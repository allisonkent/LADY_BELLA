

const axios = require('axios');

async function apkCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const query = text.split(' ').slice(1).join(' ').trim();

        if (!query) {
            return await sock.sendMessage(chatId, {
                text: "❌ Please provide an app name to search.\n\nExample: *.apk Instagram*"
            });
        }

        await sock.sendMessage(chatId, { react: { text: "⏳", key: message.key } });

        const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${query}/limit=1`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data || !data.datalist || !data.datalist.list.length) {
            return await sock.sendMessage(chatId, {
                text: "⚠️ No results found for the given app name."
            });
        }

        const app = data.datalist.list[0];
        const appSize = (app.size / 1048576).toFixed(2); // MB

        const caption = `╭━━⪨ *APK Downloader* ⪩━━┈⊷
┃ 📦 *NAME:* ${app.name}
┃ 🏋 *SIZE:* ${appSize} MB
┃ 📦 *PACKAGE:* ${app.package}
┃ 📅 *UPDATED ON:* ${app.updated}
┃ 👨‍💻 *DEVELOPER:* ${app.developer.name}
╰━━━━━━━━━━━━━━━┈⊷
> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴅᴇᴠ snowbird*`;

        await sock.sendMessage(chatId, { react: { text: "⬆️", key: message.key } });

        await sock.sendMessage(chatId, {
            document: { url: app.file.path_alt },
            fileName: `${app.name}.apk`,
            mimetype: "application/vnd.android.package-archive",
            caption: caption
        }, { quoted: message });

        await sock.sendMessage(chatId, { react: { text: "✅", key: message.key } });

    } catch (error) {
        console.error("APK Error:", error);
        await sock.sendMessage(chatId, {
            text: "❌ An error occurred while fetching the APK. Please try again."
        });
    }
}

module.exports = apkCommand;
