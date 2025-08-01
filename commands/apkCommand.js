const axios = require('axios');

async function apkCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        const query = text.split(' ').slice(1).join(' ').trim();

        if (!query) {
            return await sock.sendMessage(chatId, { 
                text: "❌ Please provide an app name to search." 
            });
        }

        // Loading message
        await sock.sendMessage(chatId, { 
            text: "_Searching for the APK..._"
        });

        const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${query}/limit=1`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data || !data.datalist || !data.datalist.list.length) {
            return await sock.sendMessage(chatId, { 
                text: "⚠️ No results found for the given app name." 
            });
        }

        const app = data.datalist.list[0];
        const appSize = (app.size / 1048576).toFixed(2); // bytes → MB

        const caption = `╭━━⪨ *APK Downloader* ⪩━━┈⊷
┃ 📦 *NAME:* ${app.name}
┃ 🏋 *SIZE:* ${appSize} MB
┃ 📦 *PACKAGE:* ${app.package}
┃ 📅 *UPDATED:* ${app.updated}
┃ 👨‍💻 *DEVELOPER:* ${app.developer.name}
╰━━━━━━━━━━━━━━━┈⊷
> *Powered by LADY BELLA*`;

        // Send the APK file
        await sock.sendMessage(chatId, {
            document: { url: app.file.path_alt },
            mimetype: 'application/vnd.android.package-archive',
            fileName: `${app.name}.apk`,
            caption: caption
        }, { quoted: message });

    } catch (error) {
        console.error("APK command error:", error);
        await sock.sendMessage(chatId, { 
            text: "❌ An error occurred while fetching the APK. Please try again later." 
        });
    }
}

module.exports = apkCommand;
