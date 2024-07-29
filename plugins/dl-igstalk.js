import axios from 'axios';
import cheerio from 'cheerio';
import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Please provide an Instagram username.\nUsage: ${usedPrefix + command} <username>`;
    
    try {
        const { key } = await conn.sendMessage(m, { text: "Please wait..." });
        await conn.sendMessage(m, { text: "Fetching data...", edit: key });
        await conn.sendMessage(m, { text: "Almost done...", edit: key });
        await conn.sendMessage(m, { text: "Finalizing...", edit: key });
        
        let res = await igstalk(args[0].replace(/^@/, ''));
        let res2 = await fetch(`https://api.lolhuman.xyz/api/stalkig/${args[0].replace(/^@/, '')}?apikey=${lolkeysapi}`);
        let res3 = await res2.json();
        let json = JSON.parse(JSON.stringify(res));
        
        let iggs = `┃ 𓃠 *Instagram Stalker*
┃ ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ 
┃ Username: *${json.username}*
┃ Full Name: *${json.fullname}*
┃ Profile: *https://instagram.com/${json.username.replace(/^@/, '')}*
┃ Followers: *${json.followers}* 
┃ Following: *${json.following}* 
┃ Posts: *${json.post}*
┃ Bio: *${json.bio}*`.trim();
        
        let profilePicture = `${res3.result.photo_profile || res.profile}`;
        await conn.sendFile(m.chat, profilePicture, 'profile.jpg', iggs, m);
        
        conn.reply(m.chat, `Here is the Instagram profile information you requested.`, m, {
            contextInfo: {
                externalAdReply: {
                    mediaUrl: null,
                    mediaType: 1,
                    description: null,
                    title: 'Instagram Profile Info',
                    body: 'Instagram Bot',
                    previewType: 0,
                    thumbnail: gataMenu,
                    sourceUrl: md
                }
            }
        });
    } catch (e) {
        await conn.reply(m.chat, `An error occurred. Please try again later. If the problem persists, contact support.\nCommand: ${usedPrefix + command}\n\nError details: ${e}`, m);
        console.log(`Error with command ${usedPrefix + command}:`, e);
        handler.money = false;
    }
};

handler.help = ['igstalk'].map(v => v + ' <username>');
handler.tags = ['downloader'];
handler.command = /^(igstalk|verig|igver)$/i;
handler.money = 150;

export default handler;

async function igstalk(Username) {
    return new Promise((resolve, reject) => {
        axios.get('https://dumpor.com/v/' + Username, {
            headers: {
                "cookie": "_inst_key=SFMyNTY.g3QAAAABbQAAAAtfY3NyZl90b2tlbm0AAAAYWGhnNS1uWVNLUU81V1lzQ01MTVY2R0h1.fI2xB2dYYxmWqn7kyCKIn1baWw3b-f7QvGDfDK2WXr8",
                "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
            }
        }).then(res => {
            const $ = cheerio.load(res.data);
            const result = {
                profile: $('#user-page > div.user > div.row > div > div.user__img').attr('style').replace(/(background-image: url\(\'|\'\);)/gi, ''),
                fullname: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > div > a > h1').text(),
                username: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > div > h4').text(),
                post: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > ul > li:nth-child(1)').text().replace(' Posts', ''),
                followers: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > ul > li:nth-child(2)').text().replace(' Followers', ''),
                following: $('#user-page > div.user > div > div.col-md-4.col-8.my-3 > ul > li:nth-child(3)').text().replace(' Following', ''),
                bio: $('#user-page > div.user > div > div.col-md-5.my-3 > div').text()
            };
            resolve(result);
        }).catch(reject);
    });
}
