// Simulated Cloud API Service for Kolatan Coffee Menu

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const simulatedLogin = async (email, password, users) => {
  await delay(800); // Simulate network latency
  const foundUser = users.find(u => u.email === email && u.password === password);
  if (foundUser) {
    return { success: true, user: foundUser };
  }
  return { success: false, message: 'Hatalı e-posta veya şifre!' };
};

export const simulatedRegister = async (newUser, users) => {
  await delay(900); // Simulate network latency
  const emailExists = users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase());
  const usernameExists = users.some(u => u.username.toLowerCase() === newUser.username.toLowerCase());
  if (emailExists || usernameExists) {
    return { success: false, message: 'Bu e-posta veya kullanıcı adı zaten kullanımda!' };
  }
  const userWithWallet = { ...newUser, balance: 100.00, stars: 0 };
  return { success: true, user: userWithWallet };
};

export const simulatedAddBalance = async (email, amount, users) => {
  await delay(1200); // Simulate secure card gateway verification
  const found = users.find(u => u.email === email);
  if (found) {
    const updated = { ...found, balance: (found.balance || 0) + amount };
    return { success: true, user: updated };
  }
  return { success: false, message: 'Kullanıcı bulunamadı.' };
};

export const simulatedCheckout = async (email, total, cartItems, users, orderHistory) => {
  await delay(1000); // Simulate transaction processing
  const found = users.find(u => u.email === email);
  if (!found) return { success: false, message: 'Oturum açmış kullanıcı bulunamadı.' };

  const currentBalance = found.balance || 0;
  if (currentBalance < total) {
    return { success: false, message: 'Bakiyeniz yetersiz! Lütfen cüzdanınıza bakiye yükleyin.' };
  }

  const starsEarned = Math.floor(total / 10);
  const updatedUser = {
    ...found,
    balance: currentBalance - total,
    stars: (found.stars || 0) + starsEarned
  };

  const newOrder = {
    items: cartItems,
    price: total,
    date: new Date().toLocaleString(),
    starsEarned: starsEarned
  };

  return { 
    success: true, 
    user: updatedUser, 
    order: newOrder 
  };
};
