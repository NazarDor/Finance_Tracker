const bcrypt = require("bcrypt");

async function hashPassword() {
  const password = "123456789"; // Ваш пароль
  const saltRounds = 10; // Количество раундов шифрования

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Хэш пароля:", hashedPassword);
  } catch (error) {
    console.error("Ошибка при хэшировании пароля:", error);
  }
}

// pastor@mail.com
// $2b$10$Z6KXW8Yr0dUxzRbClmE9R.cQO.GDeFuHj87DdDPYMxsIklTPzv2n2

hashPassword();
