const config = require('../../config/config');
const { MonthlySummary, Transaction,User } = require('../../../models');
const NotFound = require('../../errors/NotFoundError');
const { Op } = require('sequelize');
const BadRequestError = require('../../errors/BadRequestError');

class MonthlySummaryService {
    async getAll() {
        return await MonthlySummary.findAll();
    }

    async getById(id) {
        const summary = await MonthlySummary.findByPk(id);
        if (!summary) throw new NotFound('Summary Bulanan Tidak ditemukan!');
        return summary
    }

    async create(data) {
        return await MonthlySummary.create(data);
    }

    async update(id, data) {
        const summary = await MonthlySummary.findByPk(id);
        if (!summary) throw new NotFound('Summary Bulanan Tidak ditemukan!');
        await summary.update(data);
        return summary
    }

    async delete(id) {
        const summary = await MonthlySummary.findByPk(id);
        if (!summary) throw new NotFound('Summary Bulanan Tidak ditemukan!');
        await summary.destroy();
        return true
    }

    async generate(userId) {
        const date = new Date();
        const month = date.toLocaleDateString('id-ID', { month: 'long' });
        const year = date.getFullYear();

        const startOfMonth = new Date(year, date.getMonth(), 1);
        const endOfMonth = new Date(year, date.getMonth() + 1, 0);

        const startDay = new Date(date.getFullYear(), date.getMonth(), date.getDate, 0, 0, 0, 0);
        const endDay = new Date(date.getFullYear(), date.getMonth(), date.getDate, 23, 59, 59, 999);

        const exitingSummary = await MonthlySummary.findOne({
            where: {
                user_id: userId,
                created_at: {
                    [Op.gte]: startDay,
                    [Op.lte]: endDay,
                },

            }
        })

        if( exitingSummary ) {
            throw new BadRequestError('Summary Bulanan Sudah Ada Untuk Bulan Ini!');
        }

        const transaction = await Transaction.findAll({
            where:{
                user_id: userId,
                date: {
                    [Op.between]: [startOfMonth, endOfMonth]
                },
            },
            include: ['category']
        })
        const user = await User.findByPk(userId);

        if( !user ) {
            throw new NotFound('User Tidak ditemukan!');
        }

        let totalIncome = 0;
        let totalExpense = 0;

        const formattedTransactions = transaction.map((tx) => {
            const amount = parseInt(tx.amount)
            if (tx.type === 'income') {
                totalIncome += amount;
            } else if (tx.type === 'expense') {
                totalExpense += amount;
            }


            return {
                type: tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
                category: tx.category?.name || 'lainnya',
                amount,
                date: tx.date.toISOString().split('T')[0],
    
            }
        })

        const payload = {
            user : user.name,
            month: `${month} ${year}`,
            transaction: formattedTransactions,
            total_income: totalIncome,
            total_expense: totalExpense,
        }


        const body ={
            model: 'meta-llama/llama-3.3-8b-instruct:free',
            messages:[
                {
                    role: 'system',
                    content: `Posisikan Dirimu sebagai asisten keuangan pribadi dan buat ringkasan keuangan dari data JSON berikut,
                    hasilkan dalam format JSON yang valid dan harus memiliki struktur seperti ini:
                    {
                        "summary" : "string",
                        "recommendations": ["string", "string", "...],
                        "trend_analysis": "string",
                        
                    }
                    Gunakan bahasa Indonesia untuk isinya, jangan ubah nama key apapun, dan jangan tambahkan \`\`\` json. 

                    `
                },
                {
                    role: 'user',
                    content: JSON.stringify(payload)
                }
            ]
        }

        const delay = (ms) => new Promise((res) => {
            setTimeout(res, ms);

        })
        let retries = 3;
        let response;

        while (retries > 0) {
            try {
                response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${config.llm.openRouter}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(body)
                })
                if(response.status !== 429) break;
                
                await delay(3000);
                retries--;
            } catch (error) {
                retries--;
                if (retries === 0) throw error;
                await delay(1000);
            }
        }
        if(!response.ok){
            throw new BadRequestError("Terjadi kesalahan, Harap coba lagi nanti!");
        }

        const result = await response.json();   
        const content = result.choices?.[0]?.message?.content;

        let parsed
        try {
            const cleanedContent = content.replace(/```json\s*|\s*```/g, '').trim();
            parsed = JSON.parse(cleanedContent);
            if(!parsed.summary || !parsed.recommendations || !parsed.trend_analysis) {
                throw new BadRequestError('Format JSON tidak sesuai, pastikan memiliki key "summary", "recommendations", dan "trend_analysis"');
            }
        } catch (error) {
            throw new BadRequestError(error,'Gagal memparsing hasil AI, pastikan format JSON valid!');
        }


        const summary = await MonthlySummary.create({
            user_id: userId,
            month,
            year : String(year),
            total_income: totalIncome,
            total_expense: totalExpense,
            balance: String(totalIncome - totalExpense),
            ai_summary: parsed.summary,
            ai_recomendation: [...parsed.recommendations, parsed.trend_analysis].join('\n'),
            ai_trend_analysis: parsed.trend_analysis
        })

        return {
            summary: parsed.summary,
            trend_analysis: parsed.trend_analysis,
            recommendations: parsed.recommendations,
        }
    }
}


module.exports = new MonthlySummaryService();