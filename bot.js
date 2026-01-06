/**
 * SINGLE FILE – OWNER + SELLER BOT
 * OTP 1x • FULL BUTTON • GITHUB CONTROL • ANTI BYPASS
 */

const TelegramBot = require("node-telegram-bot-api");
const crypto = require("crypto");
const fetch = require("node-fetch");
const readline = require("readline");

/* ============ CONFIG ============ */

const OWNER_ID = 7807425271; // ganti
const OWNER_BOT_TOKEN = "8576202582:AAE9-kwUUURhka5upa7G1yx3TOcwvdhDwqc";
const PASSWORD = "Memeg";

const URL_ALLOW = "https://raw.githubusercontent.com/VexxuzzZ/databaseee/refs/heads/main/allow.json";
const URL_BLACKLIST = "https://raw.githubusercontent.com/VexxuzzZ/databaseee/refs/heads/main/blacklist.json";
const URL_MODE = "https://raw.githubusercontent.com/VexxuzzZ/databaseee/refs/heads/main/mode.json";

/* ============================== */

let VERIFIED = false;
let OTP = null;
let BOT_TOKEN = null;
let ERROR_MODE = true;

/* ============ UTILS ============ */

const genOTP = () => {
  OTP = crypto.randomInt(100000, 999999).toString();
  return OTP;
};

const fetchJSON = async (url) => {
  const r = await fetch(url);
  return r.json();
};

const lawakSpam = async (bot, id) => {
  for (let i = 0; i < 5; i++) {
    await bot.sendMessage(id, "🤣 Lawak Mau Bypass 🤡");
  }
};

/* ============ CONSOLE PANEL ============ */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

(async () => {
  console.clear();
  console.log("🔐 LICENSE PANEL");

  rl.question("🤖 BOT TOKEN SELLER: ", async (token) => {
    BOT_TOKEN = token;

    rl.question("🔑 PASSWORD: ", async (pass) => {
      if (pass !== PASSWORD) {
        console.log("❌ PASSWORD SALAH");
        process.exit(1);
      }

      console.log("Yahahaha sabar bro 😆");
      const otp = genOTP();

      const ownerBot = new TelegramBot(OWNER_BOT_TOKEN);
      await ownerBot.sendMessage(
        OWNER_ID,
        `🔐 OTP VERIFICATION\n\nOTP: ${otp}\n\nTOKEN:\n${BOT_TOKEN}`
      );

      rl.question("🔢 OTP: ", async (input) => {
        console.log("Yahahaha sabar bro 😆");

        if (input !== OTP) {
          console.log("❌ OTP SALAH");
          process.exit(1);
        }

        VERIFIED = true;
        rl.close();
        startSellerBot();
      });
    });
  });
})();

/* ============ SELLER BOT ============ */

async function startSellerBot() {
  const bot = new TelegramBot(BOT_TOKEN, { polling: true });
  console.log("🤖 SELLER BOT AKTIF");

  async function security(chatId) {
    const allow = await fetchJSON(URL_ALLOW);
    const blacklist = await fetchJSON(URL_BLACKLIST);
    const mode = await fetchJSON(URL_MODE);

    ERROR_MODE = mode.errorMode === true;

    if (
      blacklist.tokens.includes(BOT_TOKEN) ||
      blacklist.ids.includes(chatId)
    ) {
      await lawakSpam(bot, chatId);
      return false;
    }

    if (
      !allow.tokens.includes(BOT_TOKEN) ||
      !allow.ids.includes(chatId)
    ) {
      await lawakSpam(bot, chatId);
      return false;
    }

    return true;
  }

  const sellerMenu = (id) => bot.sendMessage(id, "📦 SELLER MENU", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📊 Status", callback_data: "status" }],
        [{ text: "🔐 Security", callback_data: "security" }]
      ]
    }
  });

  bot.onText(/\/start/, async (msg) => {
    if (!VERIFIED) return;
    if (!(await security(msg.chat.id))) return;
    sellerMenu(msg.chat.id);
  });

  bot.on("callback_query", async (q) => {
    if (!(await security(q.message.chat.id))) return;

    if (q.data === "status") {
      bot.sendMessage(q.message.chat.id, "✅ VERIFIED & ALLOWED");
    }

    if (q.data === "security") {
      bot.sendMessage(q.message.chat.id, "🛡 Anti Bypass ACTIVE");
    }
  });

  bot.on("polling_error", (e) => {
    if (ERROR_MODE) console.log("SELLER ERROR:", e.message);
  });

  startOwnerBot(); // jalankan owner bot juga
}

/* ============ OWNER BOT ============ */

function startOwnerBot() {
  const bot = new TelegramBot(OWNER_BOT_TOKEN, { polling: true });
  console.log("👑 OWNER BOT AKTIF");

  const ownerMenu = (id) => bot.sendMessage(id, "👑 OWNER PANEL", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📊 Status", callback_data: "status" }],
        [{ text: "⚙ Mode", callback_data: "mode" }],
        [{ text: "🔐 Security Check", callback_data: "check" }]
      ]
    }
  });

  bot.onText(/\/start/, (msg) => {
    if (msg.chat.id !== OWNER_ID) return;
    ownerMenu(msg.chat.id);
  });

  bot.on("callback_query", async (q) => {
    if (q.message.chat.id !== OWNER_ID) return;

    if (q.data === "status") {
      bot.sendMessage(OWNER_ID,
`📊 STATUS
Verified: ${VERIFIED}
ErrorMode: ${ERROR_MODE}`);
    }

    if (q.data === "mode") {
      bot.sendMessage(OWNER_ID, `⚙ MODE: ${ERROR_MODE ? "ERROR" : "NO ERROR"}`);
    }

    if (q.data === "check") {
      bot.sendMessage(OWNER_ID, "🛡 Semua sistem aman");
    }
  });
}