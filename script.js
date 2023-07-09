// Variables del juego
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var player = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  width: 20,
  height: 20,
  speed: 5,
  dx: 0,
  dy: 0
};

var bullets = [];
var bulletSpeed = 5;
var bulletWidth = 5;
var bulletHeight = 10;

var enemyWidth = 20;
var enemyHeight = 20;
var enemies = [];
var enemySpeed = 2;

var score = 0;

// Función para cargar los puntos del jugador desde el almacenamiento local
function loadPoints() {
  var savedPoints = localStorage.getItem("points");
  if (savedPoints) {
    score = parseInt(savedPoints);
  }
}

// Función para guardar los puntos del jugador en el almacenamiento local
function savePoints() {
  localStorage.setItem("points", score.toString());
}

// Función para dibujar el jugador
function drawPlayer() {
  ctx.beginPath();
  ctx.rect(player.x, player.y, player.width, player.height);
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.closePath();
}

// Función para mover al jugador
function movePlayer() {
  player.x += player.dx;
  player.y += player.dy;

  if (player.x < 0) {
    player.x = 0;
  } else if (player.x > canvas.width - player.width) {
    player.x = canvas.width - player.width;
  }

  if (player.y < 0) {
    player.y = 0;
  } else if (player.y > canvas.height - player.height) {
    player.y = canvas.height - player.height;
  }
}

// Función para dibujar las balas
function drawBullets() {
  for (var i = 0; i < bullets.length; i++) {
    ctx.beginPath();
    ctx.rect(bullets[i].x, bullets[i].y, bulletWidth, bulletHeight);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();

    bullets[i].y -= bulletSpeed;

    // Verificar colisión con los enemigos
    for (var j = 0; j < enemies.length; j++) {
      if (
        bullets[i].x >= enemies[j].x &&
        bullets[i].x <= enemies[j].x + enemyWidth &&
        bullets[i].y >= enemies[j].y &&
        bullets[i].y <= enemies[j].y + enemyHeight
      ) {
        bullets.splice(i, 1);
        enemies.splice(j, 1);
        score++;
        savePoints(); // Guardar los puntos después de cada colisión
        break;
      }
    }

    if (bullets[i] && bullets[i].y < 0) {
      bullets.splice(i, 1);
    }
  }
}

// Función para generar enemigos
function generateEnemies() {
  var enemy = {
    x: Math.random() * (canvas.width - enemyWidth),
    y: 0
  };
  enemies.push(enemy);
}

// Función para dibujar enemigos
function drawEnemies() {
  for (var i = 0; i < enemies.length; i++) {
    ctx.beginPath();
    ctx.rect(enemies[i].x, enemies[i].y, enemyWidth, enemyHeight);
    ctx.fillStyle = "green";
    ctx.fill();
    ctx.closePath();

    enemies[i].y += enemySpeed;

    // Verificar colisión con el jugador
    if (
      player.x < enemies[i].x + enemyWidth &&
      player.x + player.width > enemies[i].x &&
      player.y < enemies[i].y + enemyHeight &&
      player.y + player.height > enemies[i].y
    ) {
      // Colisión con el jugador
      gameOver();
    }

    // Verificar si los enemigos llegan al fondo
    if (enemies[i] && enemies[i].y > canvas.height) {
      enemies.splice(i, 1);
    }
  }
}

// Función para dibujar el puntaje
function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("Score: " + score, 8, 20);
}

// Función para el bucle principal del juego
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawScore();

  requestAnimationFrame(gameLoop);
}

// Función para finalizar el juego
function gameOver() {
  alert("Game Over");
  savePoints(); // Guardar los puntos al finalizar el juego
  location.reload();
}

// Eventos para mover al jugador
document.addEventListener("keydown", function (event) {
  if (event.keyCode === 37) {
    player.dx = -player.speed;
  } else if (event.keyCode === 39) {
    player.dx = player.speed;
  } else if (event.keyCode === 38) {
    player.dy = -player.speed;
  } else if (event.keyCode === 40) {
    player.dy = player.speed;
  } else if (event.keyCode === 32) {
    var bullet = {
      x: player.x + player.width / 2 - bulletWidth / 2,
      y: player.y
    };
    bullets.push(bullet);
  }
});

document.addEventListener("keyup", function (event) {
  if (event.keyCode === 37 || event.keyCode === 39) {
    player.dx = 0;
  } else if (event.keyCode === 38 || event.keyCode === 40) {
    player.dy = 0;
  }
});

// Generar enemigos cada 1 segundo
setInterval(generateEnemies, 1000);

// Cargar los puntos del jugador al iniciar el juego
loadPoints();

// Iniciar el bucle principal del juego
gameLoop();



