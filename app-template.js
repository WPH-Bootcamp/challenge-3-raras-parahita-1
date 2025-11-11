// ============================================
// HABIT TRACKER CLI - CHALLENGE 3
// ============================================
// NAMA: [Raras Parahita]
// KELAS: [WPH REP]
// TANGGAL: [11 November 2025]
// ============================================

// TODO: Import module yang diperlukan
// HINT: readline, fs, path
const readline = require('readline');
const fs = require('fs');
const path = require('path');



// TODO: Definisikan konstanta
// HINT: DATA_FILE, REMINDER_INTERVAL, DAYS_IN_WEEK
const DATA_FILE = path.join(__dirname, 'habits-data.json');
const REMINDER_INTERVAL = 10000; // 10 detik
const DAYS_IN_WEEK = 7;



// TODO: Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});



// ============================================
// USER PROFILE OBJECT
// ============================================
// TODO: Buat object userProfile dengan properties:
// - name
// - joinDate
// - totalHabits
// - completedThisWeek
// TODO: Tambahkan method updateStats(habits)
// TODO: Tambahkan method getDaysJoined()
const userProfile = {
  name: 'Raras Parahita',
  joinDate: new Date(),
  totalHabits: 0,
  completedThisWeek: 0,

  updateStats(habits) {
    this.totalHabits = habits.length;
    this.completedThisWeek = habits.filter(h => h.isCompletedThisWeek()).length;
  },

  getDaysJoined() {
    const now = new Date();
    const diff = Math.floor((now - this.joinDate) / (1000 * 60 * 60 * 24));
    return diff;
  },
};



// ============================================
// HABIT CLASS
// ============================================
// TODO: Buat class Habit dengan:
// - Constructor yang menerima name dan targetFrequency
// - Method markComplete()
// - Method getThisWeekCompletions()
// - Method isCompletedThisWeek()
// - Method getProgressPercentage()
// - Method getStatus()
class Habit {
  constructor(name, targetFrequency) {
    this.id = Date.now();
    this.name = name ?? 'Kebiasaan Baru';
    this.targetFrequency = targetFrequency ?? 7;
    this.completions = [];
    this.createdAt = new Date();
  }

  markComplete() {
    const today = new Date().toDateString();
    if (!this.completions.includes(today)) {
      this.completions.push(today);
      console.log(`✅ ${this.name} ditandai selesai untuk hari ini.`);
    } else {
      console.log(`⚠️  ${this.name} sudah ditandai hari ini.`);
    }
  }

  getThisWeekCompletions() {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    return this.completions.filter(dateStr => new Date(dateStr) >= startOfWeek);
  }

  isCompletedThisWeek() {
    return this.getThisWeekCompletions().length >= this.targetFrequency;
  }

  getProgressPercentage() {
    return Math.min((this.getThisWeekCompletions().length / this.targetFrequency) * 100, 100);
  }

  getStatus() {
    return this.isCompletedThisWeek() ? 'Selesai ✅' : 'Aktif 🔄';
  }
}




// ============================================
// HABIT TRACKER CLASS
// ============================================
// TODO: Buat class HabitTracker dengan:
// - Constructor
// - Method addHabit(name, frequency)
// - Method completeHabit(habitIndex)
// - Method deleteHabit(habitIndex)
// - Method displayProfile()
// - Method displayHabits(filter)
// - Method displayHabitsWithWhile()
// - Method displayHabitsWithFor()
// - Method displayStats()
// - Method startReminder()
// - Method showReminder()
// - Method stopReminder()
// - Method saveToFile()
// - Method loadFromFile()
// - Method clearAllData()

class HabitTracker {
  constructor() {
    this.habits = [];
    this.reminder = null;
    this.loadFromFile();
  }

  addHabit(name, frequency) {
    const habit = new Habit(name, frequency);
    this.habits.push(habit);
    this.saveToFile();
    console.log(`✨ Habit "${name}" berhasil ditambahkan!`);
  }

  completeHabit(index) {
    const habit = this.habits[index - 1] ?? null;
    if (habit) {
      habit.markComplete();
      this.saveToFile();
    } else {
      console.log('⚠️  Habit tidak ditemukan.');
    }
  }

  deleteHabit(index) {
    const habit = this.habits[index - 1] ?? null;
    if (habit) {
      this.habits.splice(index - 1, 1);
      this.saveToFile();
      console.log(`🗑 Habit "${habit.name}" dihapus.`);
    } else {
      console.log('⚠️  Habit tidak ditemukan.');
    }
  }

    displayProfile() {
    userProfile.updateStats(this.habits);
    console.log(`
==================================================
👤 PROFIL PENGGUNA
==================================================
Nama: ${userProfile.name}
Total Habit: ${userProfile.totalHabits}
Selesai Minggu Ini: ${userProfile.completedThisWeek}
Hari Bergabung: ${userProfile.getDaysJoined()} hari
==================================================
`);
  }

  displayHabits(filter = 'all') {
    console.log(`
==================================================
📋 DAFTAR HABIT (${filter})
==================================================`);
    let habitsToShow = this.habits;

    if (filter === 'active') habitsToShow = this.habits.filter(h => !h.isCompletedThisWeek());
    if (filter === 'completed') habitsToShow = this.habits.filter(h => h.isCompletedThisWeek());

    if (habitsToShow.length === 0) {
      console.log('Belum ada habit.');
    } else {
      habitsToShow.forEach((h, i) => {
        const progress = Math.round(h.getProgressPercentage());
        const filled = '█'.repeat(progress / 10);
        const empty = '░'.repeat(10 - progress / 10);
        console.log(`${i + 1}. [${h.getStatus()}] ${h.name}`);
        console.log(`   Target: ${h.targetFrequency}x/minggu`);
        console.log(`   Progress: ${progress}% ${filled}${empty}`);
      });
    }
  }

  displayStats() {
    const total = this.habits.length;
    const done = this.habits.filter(h => h.isCompletedThisWeek()).length;
    console.log(`
==================================================
📊 STATISTIK
==================================================
Total Habit: ${total}
Selesai Minggu Ini: ${done}
Aktif: ${total - done}
==================================================
`);
  }

  displayHabitsWithWhile() {
    console.log("Demo While Loop:");
    let i = 0;
    while (i < this.habits.length) {
      console.log(`- ${this.habits[i].name}`);
      i++;
    }
  }

  displayHabitsWithFor() {
    console.log("Demo For Loop:");
    for (let i = 0; i < this.habits.length; i++) {
      console.log(`- ${this.habits[i].name}`);
    }
  }

  startReminder() {
    if (this.reminder) return;
    this.reminder = setInterval(() => this.showReminder(), REMINDER_INTERVAL);
  }

  showReminder() {
    const pending = this.habits.filter(h => !h.isCompletedThisWeek());
    if (pending.length > 0) {
      const randomHabit = pending[Math.floor(Math.random() * pending.length)];
      console.log(`
==================================================
⏰ REMINDER: Jangan lupa "${randomHabit.name}" hari ini!
==================================================`);
    }
  }

  stopReminder() {
    if (this.reminder) clearInterval(this.reminder);
  }

  saveToFile() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(this.habits, null, 2));
  }

  loadFromFile() {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      this.habits = data.map(h => Object.assign(new Habit(), h));
    }
  }

  clearAllData() {
    this.habits = [];
    this.saveToFile();
  }
}




// ============================================
// HELPER FUNCTIONS
// ============================================
// TODO: Buat function askQuestion(question)

// ============================================
// HELPER FUNCTIONS
// ============================================
const askQuestion = (question) => {
  return new Promise((resolve) => rl.question(question, resolve));
};




// TODO: Buat function displayMenu()


// TODO: Buat async function handleMenu(tracker)
const displayMenu = () => {
  console.log(`
==================================================
HABIT TRACKER - MAIN MENU
==================================================
1. Lihat Profil
2. Lihat Semua Kebiasaan
3. Lihat Kebiasaan Aktif
4. Lihat Kebiasaan Selesai
5. Tambah Kebiasaan Baru
6. Tandai Kebiasaan Selesai
7. Hapus Kebiasaan
8. Lihat Statistik
9. Demo Loop (while/for)
0. Keluar
==================================================
`);
};


// ============================================
// MAIN FUNCTION
// ============================================
// TODO: Buat async function main()




// TODO: Jalankan main() dengan error handling

async function handleMenu(tracker) {
  while (true) {
    displayMenu();
    const choice = await askQuestion('Pilih menu: ');

    switch (choice.trim()) {
      case '1': tracker.displayProfile(); break;
      case '2': tracker.displayHabits('all'); break;
      case '3': tracker.displayHabits('active'); break;
      case '4': tracker.displayHabits('completed'); break;
      case '5':
        const name = await askQuestion('Nama kebiasaan: ');
        const freq = parseInt(await askQuestion('Target per minggu: '));
        tracker.addHabit(name, freq);
        break;
      case '6':
        tracker.displayHabits();
        const index = parseInt(await askQuestion('Nomor habit: '));
        tracker.completeHabit(index);
        break;
      case '7':
        tracker.displayHabits();
        const delIndex = parseInt(await askQuestion('Nomor habit yang dihapus: '));
        tracker.deleteHabit(delIndex);
        break;
      case '8': tracker.displayStats(); break;
      case '9':
        tracker.displayHabitsWithWhile();
        tracker.displayHabitsWithFor();
        break;
      case '0':
        tracker.stopReminder();
        rl.close();
        console.log('👋 Terima kasih sudah menggunakan Habit Tracker!');
        process.exit(0);
      default:
        console.log('❌ Pilihan tidak valid.');
    }
  }
}

async function main() {
  console.log(`
==================================================
✨ SELAMAT DATANG DI HABIT TRACKER CLI ✨
==================================================`);
  const tracker = new HabitTracker();
  tracker.startReminder();
  await handleMenu(tracker);
}

main().catch(err => console.error('Terjadi error:', err));
