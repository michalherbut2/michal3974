const { ShardingManager } = require('discord.js');
const path = require('path');
const { TOKEN } = require('./config.json'); // Upewnij się, że TOKEN jest poprawnie ustawiony

// Utwórz menedżera shardów
const manager = new ShardingManager(path.join(__dirname, 'index.js'), {
  totalShards: 'auto', // Automatyczne ustalanie liczby shardów
  token: TOKEN,
});

manager.on('shardCreate', (shard) => {
  console.log(`[INFO] Shard ${shard.id} został uruchomiony.`);
  
  shard.on('ready', () => {
    console.log(`[INFO] Shard ${shard.id} jest gotowy.`);
  });
  
  shard.on('disconnect', () => {
    console.warn(`[WARN] Shard ${shard.id} został rozłączony.`);
  });
  
  shard.on('reconnecting', () => {
    console.log(`[INFO] Shard ${shard.id} próbuje ponownie się połączyć.`);
  });
  
  shard.on('death', (process) => {
    console.error(`[ERROR] Shard ${shard.id} zakończył pracę z kodem ${process.exitCode} i sygnałem ${process.signal}.`);
  });
  
  shard.on('error', (error) => {
    console.error(`[ERROR] Błąd w shardzie ${shard.id}:`, error);
  });
  
  shard.on('message', (message) => {
    console.log(`[DEBUG] Wiadomość od sharda ${shard.id}:`, message);
  });
  
  shard.on('spawn', () => {
    console.log(`[INFO] Shard ${shard.id} został uruchomiony przez menedżera.`);
  });
  
  shard.on('exit', (code) => {
    console.warn(`[WARN] Shard ${shard.id} zakończył pracę z kodem wyjścia: ${code}`);
  });
  
  shard.on('readyTimeout', () => {
    console.error(`[ERROR] Timeout: Shard ${shard.id} nie zgłosił gotowości w oczekiwanym czasie.`);
  });

  // Dodatkowe eventy
  shard.on('close', (event) => {
    console.warn(`[WARN] Shard ${shard.id} zamknięty. Kod: ${event.code}, Powód: ${event.reason}`);
  });

  shard.on('resume', () => {
    console.log(`[INFO] Shard ${shard.id} wznowił połączenie.`);
  });

  shard.on('invalidSession', () => {
    console.error(`[ERROR] Nieprawidłowa sesja dla sharda ${shard.id}`);
  });

  shard.on('rateLimit', (rateLimitInfo) => {
    console.warn(`[WARN] Limit wywołań dla sharda ${shard.id}:`, rateLimitInfo);
  });
});

// Obsługa błędów globalnych z dodatkowymi logami
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Nieobsługiwany wyjątek:', err);
  console.error('[STACK TRACE]', err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[ERROR] Nieobsłużone odrzucenie obietnicy:', promise);
  console.error('[REASON]', reason);
});

process.on('warning', (warning) => {
  console.warn('[WARN] Ostrzeżenie:', warning);
  console.warn('[STACK TRACE]', warning.stack);
});

// Monitorowanie pamięci i wydajności
setInterval(() => {
  const memoryUsage = process.memoryUsage();
  console.log('[PERFORMANCE] Memory Usage:', {
    rss: `${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB`,
    heapTotal: `${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB`,
    heapUsed: `${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`,
  });
}, 60000); // Co 60 sekund

// Zaawansowane logowanie wydajności i cyklu życia shardów
setInterval(async () => {
  try {
    const shardStats = await manager.broadcastEval(() => ({
      id: this.shard.ids[0],
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    }));
    console.log('[SHARD STATS]', shardStats);
  } catch (error) {
    console.error('[ERROR] Nie udało się pobrać statystyk shardów:', error);
  }
}, 300000); // Co 5 minut

// Uruchom shardy z dodatkowymi logami
manager.spawn().catch((err) => {
  console.error('[FATAL] Błąd podczas uruchamiania shardów:', err);
  process.exit(1); // Zakończ proces w razie błędu
});
