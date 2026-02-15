const chatArea = document.querySelector(".chat-area");
const input = document.querySelector("#chat-input");
const sendBtn = document.querySelector("#send-btn");

// 会話履歴（AI に文脈を理解させるため）
let messages = [
  {
    role: "system",
    content: `
あなたは優しいキャリアアドバイザーです。
ユーザーの返答を理解しながら、自己分析につながる質問を1つずつ返してください。

ルール：
- 最初は軽い自己紹介から始める
- ユーザーの返答に合わせて質問を変える
- 質問は1つだけ返す
- 丁寧で親しみやすい口調で話す
`
  }
];

// チャットにメッセージを追加
function addMessage(text, sender = "bot") {
  const div = document.createElement("div");
  div.classList.add("message", sender);
  div.textContent = text;
  chatArea.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// AI に問い合わせ
async function askAI(userText) {
  const apiKey = "sk-ここに本物のキーを貼る";

  // ユーザーの発言を履歴に追加
  messages.push({ role: "user", content: userText });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
        max_tokens: 300
      })
    });

    const data = await response.json();
    const aiReply = data.choices[0].message.content;

    // AI の返答を履歴に追加
    messages.push({ role: "assistant", content: aiReply });

    // 画面に表示
    addMessage(aiReply, "bot");

  } catch (error) {
    addMessage("エラーが発生したよ…APIキーを確認してみて！", "bot");
    console.error(error);
  }
}

// ユーザー入力処理
function handleUserInput() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  askAI(text);
}

// イベント設定
sendBtn.addEventListener("click", handleUserInput);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleUserInput();
});

// 最初のメッセージ
addMessage("やっほー！まずは軽く自己紹介してほしいな〜", "bot");
