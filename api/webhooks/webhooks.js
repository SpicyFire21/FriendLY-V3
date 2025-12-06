import axios from 'axios';
const webhookUrl = 'https://discord.com/api/webhooks/1368616354093207743/tizWhVWOgmqfErGWjIDE0i9vj42SCpheWL0jGkjyUU69ojC6o3DaZrQ-Fy3N6EDGuNsG';

export const discord = async (message) => {
    try {
        await axios.post(webhookUrl, {
            content: message
        });
        console.log('✅ Webhook envoyé à Discord !');
    } catch (error) {
        console.error('❌ Erreur webhook Discord :', error);
    }
};

