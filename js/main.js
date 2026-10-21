const INITIAL_LIVES = 3;
const POINTS_PER_HIT = 10;
const LEVELS = [
    [
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 2, 2, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 5, 1, 1, 5, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],

    [
        [2, 4, 1, 1, 1, 1, 1, 1, 4, 2],
        [3, 1, 3, 1, 1, 1, 1, 3, 1, 3],
        [1, -1, 1, 1, 2, 2, 1, 1, -1, 1],
        [0, 1, 4, 1, 1, 1, 1, 4, 1, 0],
        [0, 1, 1, 5, 1, 1, 5, 1, 1, 0],
        [0, 0, 1, -1, 1, 1, -1, 1, 0, 0],
        [0, 0, 1, 2, 1, 1, 2, 1, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 0, 0, 0]
    ],
    [
        [2, 2, 2, 2, 2, 2, 2, 2],
    ],
];

const GameState = {
    MENU: 'menu',
    READY: 'ready',
    PLAYING: 'playing',
    PAUSE: 'pause',
    GAME_OVER: 'game_over',
    VICTORY: 'victory',
    UPGRADE: 'upgrade'
};

const brickType = {
    '-1': {
        hp: -1,
        type: 'wall',
        xp: 0,
        shootCD: 0
    },
    '1': {
        hp: 1,
        type: 'brick',
        xp: 5,
        shootCD: 0,
    },
    '2': {
        hp: 7,
        type: 'brick-2',
        xp: 20,
        shootCD: 0,
    },
    '3': {
        hp: 4,
        type: 'monster-1',
        xp: 10,
        shootCD: 6,
    },

    '4': {
        hp: 3,
        type: 'monster-2',
        xp: 10,
        shootCD: 5.5,
    },
    '5': {
        hp: 2,
        type: 'multiball',
        xp: 10,
        shootCD: 0
    },
};

const dropOutType = {
    heal: 'heal',
    bonusXp: 'bonusXp',
    multiBall: 'multiBall',
    bonusLive: 'bonusLive'
};


const UPGRADES = {
    'damage': {
        title: 'Công phá',
        description: 'Tăng sức tấn công',
        eachLevelDo: 1,
        maxLevel: 3,
        currentLevel: 0,
        unlockLevel: 0,
        icon: 'fa-burst',
        isUnique: false
    },

    'paddleWidth': {
        title: 'Dang rộng đôi tay',
        description: 'Tăng độ dài paddle',
        eachLevelDo: 15,
        maxLevel: 3,
        currentLevel: 0,
        unlockLevel: 0,
        icon: 'fa-arrows-left-right',
        isUnique: false
    },

    'paddleSpeed': {
        title: 'Bước chạy thoan thoắt',
        description: 'Paddle di chuyển nhanh hơn',
        eachLevelDo: 60,
        maxLevel: 3,
        currentLevel: 0,
        unlockLevel: 0,
        icon: 'fa-arrows-left-right',
        isUnique: false
    },

    'dashCd': {
        title: 'Lướt nhanh',
        description: 'Giảm thời gian hồi chiêu Dash',
        eachLevelDo: -1,
        maxLevel: 3,
        currentLevel: 0,
        unlockLevel: 0,
        icon: 'fa-arrows-left-right',
        isUnique: false
    },

    'dashDistance': {
        title: 'Bay xa',
        description: 'Tăng khoảng cách lướt',
        eachLevelDo: 30,
        maxLevel: 2,
        currentLevel: 0,
        unlockLevel: 1,
        icon: 'fa-arrows-left-right',
        isUnique: false
    },

    'powerUpTime': {
        title: 'Khả năng chịu tải',
        description: 'Tăng thời gian dùng chiêu powerUp',
        eachLevelDo: 1,
        maxLevel: 3,
        currentLevel: 0,
        unlockLevel: 1,
        icon: 'fa-arrows-left-right',
        isUnique: false
    },

    'powerUpCd': {
        title: 'Tăng cường ép xung!',
        description: "Giảm thời gian hồi chiêu power up",
        eachLevelDo: -1.5,
        maxLevel: 3,
        currentLevel: 0,
        unlockLevel: 1,
        icon: 'fa-arrows-left-right',
        isUnique: false
    }
}

const PADDLE_BASE = {width: 100, speed: 600, maxHp: 100, dashDistance: 100, dashCD: 5};
const BALL_BASE =
    {
        atk: 1,
        powerUpTime: 5,
        powerUpCD: 10,

        wizardBallTime: 5,
        wizardBallCD: 30
    };

//Ball
class Ball {
    constructor(x, y, baseAtk = BALL_BASE.atk, basePowerUpTIme = BALL_BASE.powerUpTime,
                basePowerUpCD = BALL_BASE.powerUpCD,
                wizardBallTime = BALL_BASE.wizardBallTime,
                wizardBallCD = BALL_BASE.wizardBallCD) {
        this.x = x;
        this.y = y;

        this.radius = 8;

        this.vx = 0;
        this.vy = 0;

        this.baseAtk = baseAtk;
        this.atk = this.baseAtk;
        this.powerUpAtk = this.baseAtk + 4;

        this.baseSpeed = 300;
        this.speed = this.baseSpeed;
        this.powerUpSpeed = 400;

        this.stuck = true;
        this.isAlive = true;

        this.isPowerUp = false;
        this.powerUpTime = basePowerUpTIme;
        this.powerUpCD = basePowerUpCD;

        this.powerUpTimeLeft = 0;
        this.powerUpCDleft = 0;

        this.isWizardBall = false;
        this.wizardBallTime = wizardBallTime;
        this.wizardBallCD = wizardBallCD;

        this.wizardBallTimeLeft = 0;
        this.wizardBallCDLeft = 0;
    }

    /**
     * Ứng dụng công thức chuyển động ném xiên vật lý 10, tham khảo:
     * https://vatlypt.com/chuyen-dong-nem-xien-vat-li-lop-10.html
     *
     * Công thức vx = speed * cos a
     * Công thức vy = speed * sin a
     *
     * sin a = đối / huyền
     * cos a = kề / huyền
     *
     * Gọi AB là khoảng cách từ ball -> mouse là cạnh huyền, cho hai đường thẳng
     * kéo dài từ A và B giao nhau tạo thành C, hình thành nên tam giác vuông ABC vuông tại C
     *
     * góc a là góc CBA => AC là cạnh đối, BC là cạnh kề
     *
     * => sin a = AC / AB, cos a = BC / AB
     * => vx = speed * (CB / AB)
     * => vy = speed * (AC / AB)
     */

    launch(mouse) {
        const mouseX = mouse.x;
        const mouseY = mouse.y;

        let AB = Math.sqrt(Math.pow(mouseX - this.x, 2) + Math.pow(mouseY - this.y, 2));
        let BC = mouseX - this.x;
        let AC = Math.abs(mouseY - this.y);

        let direction = Math.sign(BC);

        this.stuck = false;
        this.vx = direction * this.speed * (Math.abs(BC) / AB);
        this.vy = -this.speed * (AC / AB);
    }

    wizardBall(mouseClickPos) {
        const mouseX = mouseClickPos.x;
        const mouseY = mouseClickPos.y;

        let AB = Math.sqrt(Math.pow(mouseX - this.x, 2) + Math.pow(mouseY - this.y, 2));
        let BC = mouseX - this.x;
        let AC = mouseY - this.y;

        this.vx = this.speed * (BC / AB);
        this.vy = this.speed * (AC / AB);
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.stuck = true;
        this.isAlive = true;
        this.resetPowerUp();
        this.resetWizardBall();
    }

    update(input, dt, powerUp, wizardBall, click) {
        if (this.stuck) return;

        if (powerUp && this.powerUpTimeLeft <= 0 && this.powerUpCDleft <= 0 && !this.isPowerUp) {
            this.powerUpTimeLeft = this.powerUpTime;
            this.powerUpCDleft = this.powerUpCD;
            this.speed = this.powerUpSpeed;
            this.atk = this.powerUpAtk;
            this.isPowerUp = true;
        }

        if (this.powerUpTimeLeft <= 0 && this.isPowerUp) {
            this.resetPowerUp();
        }

        if (this.powerUpTimeLeft > 0) {
            this.powerUpTimeLeft = Math.max(0, this.powerUpTimeLeft -= dt);
        }

        if (this.powerUpCDleft > 0 && this.powerUpTimeLeft <= 0) {
            this.powerUpCDleft = Math.max(0, this.powerUpCDleft -= dt);
        }

        if (wizardBall && this.wizardBallTimeLeft <= 0 && this.wizardBallCDLeft <= 0
            && !this.isWizardBall) {
            this.wizardBallTimeLeft = this.wizardBallTime;
            this.wizardBallCDLeft = this.wizardBallCD;
            this.isWizardBall = true;
        }

        if (this.isWizardBall && click) {
            this.wizardBall(input.mouseClickPos);
        }

        if (this.wizardBallTimeLeft <= 0 && this.isWizardBall) {
            this.resetWizardBall();
        }

        if (this.wizardBallTimeLeft > 0) {
            this.wizardBallTimeLeft = Math.max(0, this.wizardBallTimeLeft -= dt);
        }

        if (this.wizardBallCDLeft > 0 && this.wizardBallTimeLeft <= 0) {
            this.wizardBallCDLeft = Math.max(0, this.wizardBallCDLeft -= dt);
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    ballLost() {
        this.isAlive = false;
    }

    resetPowerUp() {
        this.isPowerUp = false;
        this.powerUpTimeLeft = 0;
        this.speed = this.baseSpeed;
        this.atk = this.baseAtk;
    }

    resetWizardBall() {
        this.isWizardBall = false;
        this.wizardBallTimeLeft = 0;
    }
}

//Brick
class Brick {
    constructor(x, y, height, width, hp, type, xp, shootCD) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.hp = hp;
        this.type = type;
        this.xp = xp;

        this.shootCD = shootCD;
        this.shootTimeLeft = Math.floor(Math.random() * this.shootCD);
    }

    alive() {
        return this.type === 'wall' || this.hp > 0;
    }

    hit(atk) {
        if (this.type === 'wall') return;
        this.hp = Math.max(0, this.hp - atk);
    }

    shootBullet(paddle) {
        switch (this.type) {
            case'monster-1':
                return new Bullet(this.x + this.width / 2, this.y + this.height, paddle, 8, 10, 175, 0, 150, 'monster-1');
            case'monster-2':
                let desX = paddle.x + paddle.width / 2;
                let desY = paddle.y;

                let speed = 300;

                let AB = Math.sqrt(Math.pow(desX - this.x, 2) + Math.pow(desY - this.y, 2));
                let BC = desX - this.x;
                let AC = desY - this.y;

                let vx = speed * (BC / AB);
                let vy = speed * (AC / AB);
                return new Bullet(this.x + this.width / 2, this.y + this.height, paddle, 5, 12, 260, vx, vy, 'monster-2');
        }
    }

    update(dt, paddle) {
        if (this.shootTimeLeft <= 0) {
            this.shootTimeLeft = this.shootCD;
            return this.shootBullet(paddle);
        } else {
            this.shootTimeLeft -= dt;
        }
    }
}

//Bullet
class Bullet {
    constructor(x, y, paddle, radius, damage, speed, vx, vy, type) {
        this.x = x;
        this.y = y;

        this.vx = vx;
        this.vy = vy;

        this.speed = speed;

        this.radius = radius;
        this.damage = damage;

        this.alive = true;
        this.paddle = paddle;

        this.type = type;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    bulletLost() {
        this.alive = false;
    }
}


//Paddle
class Paddle {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.width = PADDLE_BASE.width;
        this.height = 15;

        this.speed = PADDLE_BASE.speed;

        this.maxHp = PADDLE_BASE.maxHp;
        this.hp = this.maxHp;

        this.dashDistance = PADDLE_BASE.dashDistance;
        this.dashCD = PADDLE_BASE.dashCD;

        this.dashCooldownLeft = 0;
    }

    update(dt, input, maxWidth, dash) {
        let isMoving = input.left || input.right;

        if (dash && isMoving && this.dashCooldownLeft <= 0) {
            this.x += input.left ? -1 * this.dashDistance : this.dashDistance;
            this.dashCooldownLeft = this.dashCD;
        }

        if (input.left) {
            this.x -= dt * this.speed;
        }

        if (input.right) {
            this.x += dt * this.speed;
        }

        if (this.dashCooldownLeft > 0) {
            this.dashCooldownLeft = Math.max(0, this.dashCooldownLeft -= dt);
        }

        if (this.x < 0) {
            this.x = 0;
        }

        if (this.x + this.width > maxWidth) {
            this.x = maxWidth - this.width;
        }
    }

    resetDash() {
        this.dashCooldownLeft = 0;
    }

    reset() {
        this.width = PADDLE_BASE.width;
        this.speed = PADDLE_BASE.speed;
        this.maxHp = PADDLE_BASE.maxHp;
        this.hp = this.maxHp;
        this.dashDistance = PADDLE_BASE.dashDistance;
        this.dashCD = PADDLE_BASE.dashCD;
        this.dashCooldownLeft = 0;
    }

    updateHp(hp) {
        this.hp = Math.min(this.maxHp, Math.max(0, this.hp + hp));
    }
}

//Drop out
class DropOut {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 120;

        this.radius = 10;

        this.type = type;

        this.alive = true;
    }
    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    dropOutLost() {
        this.alive = false;
    }


}
//Level
class Level {
    get total() {
        return LEVELS.length;
    }

    constructor(index = 0) {
        this.grid = LEVELS[index];
        this.bricks = [];
        this.rows = this.grid.length;
        this.cols = this.grid[0].length;
        this.createBrick();
    }

    createBrick() {
        const brickWidth = 80;
        const brickHeight = 30;
        const gap = 0;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const x = col * (brickWidth + gap);
                const y = row * (brickHeight + gap);
                if (this.grid[row][col] !== 0) {
                    const hp = brickType[this.grid[row][col]].hp;
                    const type = brickType[this.grid[row][col]].type;
                    const xp = brickType[this.grid[row][col]].xp;
                    const shootCD = brickType[this.grid[row][col]].shootCD;
                    this.bricks.push(
                        new Brick(x, y, brickHeight, brickWidth, hp, type, xp, shootCD)
                    );
                }
            }
        }
        return this.bricks
    }

    get remaining() {
        return this.bricks.filter(b => b.type !== 'wall' && b.hp > 0).length;
    }

    isCleared() {
        return this.remaining === 0;
    }
}

//Collision
class Collision {
    ballWithWall(ball, width) {
        //Top
        if (ball.y - ball.radius <= 0) {
            ball.y = ball.radius;
            ball.vy *= -1;
        }

        //Right
        if (ball.x + ball.radius >= width) {
            ball.x = width - ball.radius;
            ball.vx *= -1;
        }

        //Left
        if (ball.x - ball.radius <= 0) {
            ball.x = ball.radius;
            ball.vx *= -1;
        }
    }

    ballWithPaddle(ball, paddle) {
        const hit =
            ball.x + ball.radius >= paddle.x &&
            ball.x - ball.radius <= paddle.x + paddle.width &&
            ball.y + ball.radius >= paddle.y &&
            ball.y - ball.radius <= paddle.y + paddle.height;

        if (!hit) return;
        if (ball.y > paddle.y + (paddle.height / 2)) return;

        const center = paddle.x + (paddle.width / 2);
        let offset = (ball.x - center) / (paddle.width / 2);

        /**
         *
         * Đưa offset về dạng [-1, 1] để dùng cho công thức sau
         */
        offset = Math.max(-1, Math.min(1, offset));

        /**
         * Ứng dụng công thức chuyển động ném xiên vật lý 10, tham khảo:
         * https://vatlypt.com/chuyen-dong-nem-xien-vat-li-lop-10.html
         *
         * Công thức vx = speed * cos a
         * Công thức vy = speed * sin a
         *
         * sin a = đối / huyền
         * cos a = kề / huyền
         *
         * Lúc này do bóng va chạm paddle, ta có offset nằm ngang và
         * cạnh k vuông góc với offset, hai cạnh giao nhau tại góc vuông C,
         * cạnh huyền AB chính là đường đi, góc a lúc này chính là góc CAB trong tam giác.
         *
         * Lúc này ta sẽ gọi offset là AC
         * Cạnh huyền là AB
         * k giao nhau với AB và AC tạo thành BC
         *
         * AC là cạnh kề
         * BC là cạnh đối
         *
         * Có offset được được chuẩn hóa thành [-1; 1]
         * Nhưng do B không xác định nên ta sẽ dùng hằng số k là độ dài của BC
         * để xác định góc nảy của bóng
         *
         * => cos a = AC / AB, sin a = BC / AB
         * => vx = speed * (AC / AB)
         * => vy = speed * (BC / AB)
         */

        const BC = 1;
        const AB = Math.sqrt(offset * offset + BC * BC);

        ball.vx = ball.speed * (offset / AB);
        ball.vy = -ball.speed * (BC / AB);
    }

    bulletWidthPaddle(bullet, paddle) {
        const hit =
            bullet.x + bullet.radius >= paddle.x &&
            bullet.x - bullet.radius <= paddle.x + paddle.width &&
            bullet.y + bullet.radius >= paddle.y &&
            bullet.y - bullet.radius <= paddle.y + paddle.height;

        if (!hit) return;
        bullet.bulletLost();
        paddle.updateHp(-bullet.damage);
    }

    dropOutWithPaddle(dropOut, paddle) {
        const hit =
            dropOut.x + dropOut.radius >= paddle.x &&
            dropOut.x - dropOut.radius <= paddle.x + paddle.width &&
            dropOut.y + dropOut.radius >= paddle.y &&
            dropOut.y - dropOut.radius <= paddle.y + paddle.height;

        if (!hit) return;
        dropOut.dropOutLost();
        return dropOut.type;
    }


    ballWithBrick(ball, brick) {
        const hit
            = ball.x + ball.radius >= brick.x &&
            ball.x - ball.radius <= brick.x + brick.width &&
            ball.y + ball.radius >= brick.y &&
            ball.y - ball.radius <= brick.y + brick.height &&
            brick.hp !== 0;

        if (!hit) return false;

        brick.hit(ball.atk);
        const left = Math.abs((ball.x + ball.radius) - brick.x);
        const right = Math.abs((brick.x + brick.width) - (ball.x - ball.radius));
        const top = Math.abs((ball.y + ball.radius) - brick.y);
        const bottom = Math.abs((brick.y + brick.height) - (ball.y - ball.radius));

        const min = Math.min(left, right, top, bottom);

        switch (min) {
            case left:
                ball.x = brick.x - ball.radius;
                ball.vx *= -1;
                break;
            case right:
                ball.x = (brick.x + brick.width) + ball.radius;
                ball.vx *= -1;
                break;
            case top:
                ball.y = (brick.y - ball.radius);
                ball.vy *= -1;
                break;
            case bottom:
                ball.y = (brick.y + brick.height + ball.radius);
                ball.vy *= -1;
                break;
            default:
                break;
        }
        return true;
    }


}

// Input
class Input {
    constructor(canvas) {
        this.left = false;
        this.right = false;
        this.mouse = {x: canvas.width / 2, y: canvas.height / 2};
        this.actions = new Set();
        this.mouseClickPos = {x: 0, y: 0};

        window.addEventListener('keydown', (event) => {
            if (['Space', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'KeyA', 'KeyD', 'KeyW', 'Digit1',
                'Digit2', 'Digit3', 'KeyQ'].includes(event.code)) {
                event.preventDefault();
            }
            if (event.repeat) return;

            switch (event.code) {
                case 'KeyA':
                case 'ArrowLeft':
                    this.left = true;
                    break;
                case 'KeyD':
                case 'ArrowRight':
                    this.right = true;
                    break;
                case 'ShiftLeft':
                    this.actions.add('dash');
                    break;
                case 'KeyW':
                    this.actions.add('powerUp');
                    break;
                case 'Space':
                case 'Enter':
                    this.actions.add('confirm');
                    break;
                case 'KeyP':
                case 'Escape':
                    this.actions.add('pause');
                    break;
                case 'Digit1':
                    this.actions.add('pick0');
                    break;
                case 'Digit2':
                    this.actions.add('pick1');
                    break;
                case 'Digit3':
                    this.actions.add('pick2');
                    break;
                case 'KeyQ':
                    this.actions.add('wizardBall');
                    break;
            }
        });

        window.addEventListener('keyup', (event) => {
            if (event.code === 'ArrowLeft' || event.code === 'KeyA') this.left = false;
            if (event.code === 'ArrowRight' || event.code === 'KeyD') this.right = false;
        });

        canvas.addEventListener('mousedown', () => {
            this.actions.add('confirm');
            this.actions.add('click');

            const rect = canvas.getBoundingClientRect();

            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;

            this.mouseClickPos = {x, y};
        });

        canvas.addEventListener('mousemove', (event) => {
            const rect = canvas.getBoundingClientRect();

            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;

            this.mouse = {x, y};
        });
    }

    deleteAction(action) {
        return this.actions.delete(action);
    }
}

//Game
class Game {
    constructor(input) {
        this.input = input;
        this.width = 800;
        this.height = 600;

        this.score = 0;
        this.lives = INITIAL_LIVES;
        this.levelIndex = 1;

        this.xp = 0;
        this.xpScale = 50;
        this.playerLevel = 1;

        this.ballAtk = BALL_BASE.atk;
        this.ballPowerUpTime = BALL_BASE.powerUpTime;
        this.ballPowerUpCD = BALL_BASE.powerUpCD;

        this.wizardBallTime = BALL_BASE.wizardBallTime;
        this.wizardBallCD = BALL_BASE.wizardBallCD;


        this.paddle = new Paddle(this.width / 2 - 50, this.height - 40);
        this.balls = [new Ball(0, 0, this.ballAtk, this.ballPowerUpTime, this.ballPowerUpCD
            , this.wizardBallTime, this.wizardBallCD)];
        this.level = null;

        this.collision = new Collision();
        this.loadLevel(this.levelIndex);
        this.state = GameState.MENU;
        this.tmpState = this.state;

        this.tmpUpgrade = [];
        this.resetUpgrade();

        this.bullets = [];

        this.dropOuts = [];
    }

    update(dt) {
        const confirm = this.input.deleteAction('confirm');
        const pause = this.input.deleteAction('pause');
        const dash = this.input.deleteAction('dash');
        const powerUp = this.input.deleteAction('powerUp');
        const wizardBall = this.input.deleteAction('wizardBall');
        const click = this.input.deleteAction('click');

        let pick = -1;
        for (let i = 0; i < 3; i++) {
            if (this.input.deleteAction('pick' + i)) pick = i;
        }

        switch (this.state) {
            case GameState.UPGRADE:
                if (pick >= 0) {
                    this.pickUpgrade(pick);
                }
                break;
            case GameState.MENU:
            case GameState.GAME_OVER:
            case GameState.VICTORY:
                if (confirm) this.startNewGame();
                break;

            case GameState.READY:
                this.updateReady(dt, confirm);
                break;

            case GameState.PLAYING:
                if (pause) {
                    this.state = GameState.PAUSE;
                } else {
                    this.updatePlaying(dt, dash, powerUp, wizardBall, click);
                }
                break;

            case GameState.PAUSE:
                if (pause || confirm) this.state = GameState.PLAYING;
                break;
        }
    }

    updateReady(dt, confirm) {
        this.paddle.update(dt, this.input, this.width);
        this.stickBallToPaddle();

        if (confirm) {
            this.balls[0].launch(this.input.mouse);
            this.state = GameState.PLAYING;
        }
    }

    updatePlaying(dt, dash, powerUp, wizardBall, click) {
        for (const brick of this.level.bricks) {
            if (brick.alive()) {
                let bullet = brick.update(dt, this.paddle);
                if (bullet !== undefined) this.bullets.push(bullet)
            }
        }

        for (const bullet of this.bullets) {
            bullet.update(dt);
            this.collision.bulletWidthPaddle(bullet, this.paddle);
            if (bullet.y - bullet.radius > this.height) bullet.bulletLost();
        }

        for (const dropOut of this.dropOuts) {
            dropOut.update(dt);
            const typeOfDrop = this.collision.dropOutWithPaddle(dropOut, this.paddle);
            if(typeOfDrop !== undefined) this.handleDrop(typeOfDrop);
            if (dropOut.y - dropOut.radius > this.height) dropOut.dropOutLost();
        }

        for (const ball of this.balls) {
            ball.update(this.input, dt, powerUp, wizardBall, click);
            this.collision.ballWithWall(ball, this.width);
            this.collision.ballWithPaddle(ball, this.paddle);
            for (const brick of this.level.bricks) {
                if (this.collision.ballWithBrick(ball, brick)) {
                    if (brick.type !== 'wall') this.score += POINTS_PER_HIT;

                    if (!brick.alive()) {
                        this.xp += brick.xp;
                        const dropOut = this.spawnDropOut(brick);
                        if(dropOut !== undefined) this.dropOuts.push(dropOut);
                    }

                    if (brick.type === 'multiball' && !brick.alive()) {
                        this.spawnMultiball(ball);
                    }
                    break;
                }
            }
            if (ball.y - ball.radius > this.height) {
                ball.ballLost();
            }
        }

        this.balls = this.balls.filter(ball => ball.isAlive);
        this.bullets = this.bullets.filter(bullet => bullet.alive);
        this.dropOuts = this.dropOuts.filter(dropOut => dropOut.alive);
        this.paddle.update(dt, this.input, this.width, dash);

        if (this.level.isCleared()) {
            this.onLevelCleared();
        } else if (this.balls.length === 0) {
            this.onBallLost()
        } else if (this.paddle.hp <= 0) {
            this.state = GameState.GAME_OVER;
        }
        if (this.xp >= this.xpScale) {
            this.levelUp();
        }
    }

    startNewGame() {
        this.score = 0;
        this.lives = INITIAL_LIVES;
        this.xp = 0;
        this.xpScale = 50;
        this.playerLevel = 1;
        this.paddle.reset();
        this.resetUpgrade();
        this.loadLevel(1);
        this.state = GameState.READY;
        this.bullets = [];
        this.dropOuts = [];
    }

    onBallLost() {
        this.lives--;
        if (this.lives <= 0) {
            this.state = GameState.GAME_OVER;
        } else {
            this.resetBall();
            this.state = GameState.READY;
        }
    }

    onLevelCleared() {
        if (this.levelIndex + 1 < this.level.total) {
            this.loadLevel(this.levelIndex + 1);
            this.paddle.hp = this.paddle.maxHp;
            this.lives = 3;
            this.state = GameState.READY;
        } else {
            this.state = GameState.VICTORY;
        }
    }

    loadLevel(index) {
        this.levelIndex = index;
        this.level = new Level(index);
        this.bullets = [];
        this.resetBall();
    }

    resetBall() {
        this.paddle.x = this.width / 2 - this.paddle.width / 2;
        this.bullets = [];
        this.balls = [new Ball(0, 0, this.ballAtk, this.ballPowerUpTime, this.ballPowerUpCD)];
        this.stickBallToPaddle();
        this.paddle.resetDash();
    }

    stickBallToPaddle() {
        this.balls[0].x = this.paddle.x + this.paddle.width / 2;
        this.balls[0].y = this.paddle.y - this.balls[0].radius;
    }

    spawnMultiball(srcBall) {
        let newBall1 = new Ball(srcBall.x, srcBall.y, this.ballAtk, this.ballPowerUpTime, this.ballPowerUpCD
            , this.wizardBallTime, this.wizardBallCD);
        newBall1.vx = -srcBall.vx / 2;
        newBall1.vy = srcBall.vy + (srcBall.vx / 2);
        newBall1.stuck = false;
        this.balls.push(newBall1);

        let newBall2 = new Ball(srcBall.x, srcBall.y, this.ballAtk, this.ballPowerUpTime, this.ballPowerUpCD
            , this.wizardBallTime, this.wizardBallCD);
        newBall2.vx = -srcBall.vx * 2;
        newBall2.vy = srcBall.vy + (srcBall.vx / 2);
        newBall2.stuck = false;
        this.balls.push(newBall2);
    }

    levelUp() {
        if (this.state === GameState.PLAYING || this.state === GameState.READY) {
            if (this.xp >= this.xpScale) {
                this.playerLevel += 1;
                this.paddle.maxHp += 10;
                this.paddle.hp = this.paddle.maxHp;
                this.xp -= this.xpScale;
                this.xpScale = Math.round(this.xpScale * 1.5);
                this.tmpState = this.state;
                this.rollUpgrade();
                if (this.tmpUpgrade.length !== 0) {
                    this.state = GameState.UPGRADE;
                }
            }
        }
    }

    applyUpgrade() {
        for (const id in UPGRADES) {
            const upgrade = UPGRADES[id];
            switch (upgrade) {
                case UPGRADES.paddleWidth:
                    this.paddle.width = PADDLE_BASE.width + upgrade.currentLevel * upgrade.eachLevelDo;
                    break;
                case UPGRADES.paddleSpeed:
                    this.paddle.speed = PADDLE_BASE.speed + upgrade.currentLevel * upgrade.eachLevelDo;
                    break;
                case UPGRADES.dashCd:
                    this.paddle.dashCD = PADDLE_BASE.dashCD + upgrade.currentLevel * upgrade.eachLevelDo;
                    break;
                case UPGRADES.dashDistance:
                    this.paddle.dashDistance = PADDLE_BASE.dashDistance + upgrade.currentLevel * upgrade.eachLevelDo;
                    break;
                case UPGRADES.damage:
                    this.ballAtk = BALL_BASE.atk + upgrade.currentLevel * upgrade.eachLevelDo;
                    for (let ball of this.balls) {
                        ball.baseAtk = this.ballAtk;
                        ball.powerUpAtk = this.ballAtk + 4;
                        ball.atk = ball.isPowerUp ? ball.powerUpAtk : ball.baseAtk;
                    }
                    break;
                case UPGRADES.powerUpCd:
                    this.ballPowerUpCD = BALL_BASE.powerUpCD + upgrade.currentLevel * upgrade.eachLevelDo;
                    for (const ball of this.balls) {
                        ball.powerUpCD = this.ballPowerUpCD;
                    }
                    break;
                case UPGRADES.powerUpTime:
                    this.ballPowerUpTime = BALL_BASE.powerUpTime + upgrade.currentLevel * upgrade.eachLevelDo;
                    for (const ball of this.balls) {
                        ball.powerUpTime = this.ballPowerUpTime;
                    }
                    break;
            }
        }
    }

    rollUpgrade() {
        const availableUpgrades = [];
        for (const id in UPGRADES) {
            const upgrade = UPGRADES[id];
            if (upgrade.currentLevel < upgrade.maxLevel && upgrade.unlockLevel <= this.levelIndex) {
                availableUpgrades.push(upgrade);
            }
        }
        const result = [];
        const numOfCardNeedToDraw = Math.min(3, availableUpgrades.length);
        for (let i = 0; i < numOfCardNeedToDraw; i++) {
            const randomIndex = Math.floor(Math.random() * availableUpgrades.length);
            result.push(availableUpgrades[randomIndex]);
            availableUpgrades.splice(randomIndex, 1);
        }
        this.tmpUpgrade = result;
    }

    pickUpgrade(upgradeIndex) {
        const upgrade = this.tmpUpgrade[upgradeIndex];
        if (upgrade === undefined) return;
        upgrade.currentLevel += 1;
        this.applyUpgrade();
        this.state = this.tmpState;
        this.levelUp();
    }

    resetUpgrade() {
        for (const id in UPGRADES) {
            UPGRADES[id].currentLevel = 0;
        }
        this.applyUpgrade();

        this.tmpUpgrade = [];
    }

    spawnDropOut(brick) {
        const roll = Math.random();

        if(roll < 0.4) {
            return;
        } else if(roll < 0.6) {
            return new DropOut(brick.x + brick.width / 2, brick.y + brick.height / 2, dropOutType.heal);
        } else if (roll < 0.7) {
            return new DropOut(brick.x + brick.width / 2, brick.y + brick.height / 2, dropOutType.bonusXp);
        } else if (roll < 0.8) {
            return new DropOut(brick.x + brick.width / 2, brick.y + brick.height / 2, dropOutType.bonusLive);
        } else if (roll < 0.9) {
            return new DropOut(brick.x + brick.width / 2, brick.y + brick.height / 2, dropOutType.multiBall);
        }
    }

    handleDrop(type) {
        switch (type) {
            case dropOutType.heal:
                this.paddle.updateHp(20);
                break;
            case dropOutType.bonusXp:
                this.xp += 50;
                break;
            case dropOutType.bonusLive:
                this.lives += 1;
                break;
            case dropOutType.multiBall:
                this.spawnMultiball(this.balls[0]);
                break;
        }
    }
}

//Game Loop
class GameLoop {
    constructor(update, render) {
        this.update = update;
        this.render = render;
        this.lastTime = 0;
    }

    start() {
        requestAnimationFrame((time) => {
            this.lastTime = time;
            this.loop(time);
        });
    }

    loop(currentTime) {
        const dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        this.update(dt);
        this.render();
        requestAnimationFrame(this.loop.bind(this));
    }
}

// Renderer
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.ctx.fillStyle = 'white'
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBullet(bullets) {
        for (const bullet of bullets)
            if (bullet.alive) {
                const ctx = this.ctx;

                switch (bullet.type) {
                    case 'monster-1':
                        ctx.fillStyle = "red";
                        break;
                    case 'monster-2':
                        ctx.fillStyle = "yellow";
                        break;
                }

                ctx.beginPath();
                ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
                ctx.fill();
            }
    }
    drawDropOuts(dropOuts) {
        const ctx = this.ctx;
        const colors = {heal: 'lime', bonusXp: 'gold', multiBall: 'purple', bonusLive: 'hotpink'};
        for (const dropOut of dropOuts) {
            switch(dropOut.type) {
                case dropOutType.heal:
                    ctx.fillStyle = 'lime';
                    break;
                case dropOutType.bonusXp:
                    ctx.fillStyle = 'gold';
                    break;
                case dropOutType.bonusLive:
                    ctx.fillStyle = 'hotpink';
                    break;
                case dropOutType.multiBall:
                    ctx.fillStyle = 'purple';
                    break;
            }
            ctx.beginPath();
            ctx.arc(dropOut.x, dropOut.y, dropOut.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawBall(balls) {
        for (const ball of balls) {
            const ctx = this.ctx;
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawPaddle(paddle) {
        const ctx = this.ctx;
        ctx.fillStyle = "white";
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    drawLaunchLine(ball, mouse) {
        const ctx = this.ctx;
        let gradient = ctx.createLinearGradient(ball.x, ball.y, mouse.x, mouse.y);

        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.beginPath();
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(mouse.x, mouse.y);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;

        ctx.stroke();
        ctx.closePath();
    }

    drawBricks(bricks) {
        const ctx = this.ctx;
        for (const brick of bricks) {
            if (!brick.alive()) {
                continue;
            }
            switch (brick.type) {
                case 'wall':
                    ctx.fillStyle = ' gray';
                    break;
                case 'brick':
                    ctx.fillStyle = "#0d6efd";
                    break;
                case 'brick-2':
                    ctx.fillStyle = "blue";
                    break;
                case 'monster-1':
                    ctx.fillStyle = "red";
                    break;
                case 'monster-2':
                    ctx.fillStyle = "yellow";
                    break;
                case 'multiball':
                    ctx.fillStyle = "purple";
                    break;
            }
            ctx.fillRect(brick.x,
                brick.y,
                brick.width,
                brick.height);

            if (brick.type !== 'wall') {
                ctx.fillStyle = "white";
                ctx.font = "bold 12px Arial";
                ctx.fillText(brick.hp.toString(),
                    brick.x + brick.width / 2,
                    brick.y + brick.height / 2);
            }

            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeRect(brick.x,
                brick.y,
                brick.width,
                brick.height);
        }
    }

    drawOverlay(game) {
        let title = null;
        let subtitle = null;
        let dim = true;

        switch (game.state) {
            case GameState.MENU:
                title = 'BREAK STORM';
                subtitle = 'Nhấn SPACE để bắt đầu';
                break;
            case GameState.READY:
                subtitle = 'Nhấn SPACE hoặc click để phóng bóng \n Dùng chuột để điều hướng bóng';
                this.drawLaunchLine(game.balls[0], game.input.mouse);
                dim = false;
                break;
            case GameState.PAUSE:
                title = 'PAUSE';
                subtitle = 'Nhấn P để tiếp tục';
                break;
            case GameState.GAME_OVER:
                title = 'GAME OVER';
                subtitle = `Điểm: ${game.score} - nhấn SPACE để chơi lại`;
                break;
            case GameState.VICTORY:
                title = 'CHIẾN THẮNG!';
                subtitle = `Điểm: ${game.score} - nhấn SPACE để chơi lại`;
                break;
            default:
                return;
        }

        const ctx = this.ctx;
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        ctx.save();

        if (dim) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (title) {
            ctx.font = 'bold 48px Arial';
            ctx.fillText(title, cx, cy - 30);
        }
        if (subtitle) {
            ctx.font = '20px Arial';
            ctx.fillText(subtitle, cx, title ? cy + 25 : cy + 60);
        }
        ctx.restore();
    }
}

//UI Manager
class UIManager {
    constructor() {
        this.score = document.querySelector('#score');
        this.level = document.querySelector('#level');
        this.lives = document.querySelector('#lives');

        this.dashReady = document.querySelector('#dash-ready');
        this.powerUpReady = document.querySelector('#power-up-ready')

        this.hpBar = document.querySelector('#hp-bar');
        this.xpBar = document.querySelector('#xp-bar');
        this.breakBar = document.querySelector('#break-wrapper');
        this.playerLevel = document.querySelector('#player-level');
        this.hpWrapper = document.querySelector('#hp-wrapper');

        this.hpProgress = document.querySelector('#hp-progress');
        this.xpProgress = document.querySelector('#xp-progress');

        this.upgrade = document.querySelector('#upgrade');
        this.cards = document.querySelectorAll('#upgrade .card');
    }

    update(game) {
        this.setText(this.score, game.score);
        this.setText(this.level, game.levelIndex + 1);
        this.setText(this.lives, game.lives);
        this.setText(this.playerLevel, game.playerLevel);
        this.setHpProgress(game);
        this.setXpProgress(game);
        this.setDashProgress(game);
        this.setPowerUpProgress(game);
        this.showUpgrade(game);
    }

    setText(element, value) {
        const text = String(value);
        if (element.textContent !== text) {
            element.textContent = text;
        }
    }


    setPowerUpProgress(game) {
        if (game.balls.length === 0) return;
        const cooldownLeft = game.balls[0].powerUpCDleft;
        const cooldown = game.balls[0].powerUpCD;

        const percent = Math.max(
            0,
            Math.min(
                100,
                Math.round(((cooldown - cooldownLeft) / cooldown) * 100)
            )
        );

        this.powerUpReady.style.width = `${percent}%`;
        this.powerUpReady.setAttribute('aria-valuenow', String(percent));
    }

    setDashProgress(game) {
        const cooldownLeft = game.paddle.dashCooldownLeft;
        const cooldown = game.paddle.dashCD;

        const percent = Math.max(
            0,
            Math.min(
                100,
                Math.round(((cooldown - cooldownLeft) / cooldown) * 100)
            )
        );

        this.dashReady.style.width = `${percent}%`;
        this.dashReady.setAttribute('aria-valuenow', String(percent));
    }

    setHpProgress(game) {
        const hp = Math.max(0, Math.round(game.paddle.hp));
        const maxHp = game.paddle.maxHp;

        const percent = Math.min(100, Math.round((hp / maxHp) * 100));
        this.hpProgress.style.width = `${percent}%`;
        this.hpProgress.setAttribute('aria-valuenow', String(percent));
        this.hpProgress.textContent = hp + " / " + maxHp;
    }

    setXpProgress(game) {
        const xp = game.xp;
        const xpScale = game.xpScale;

        const percent = Math.min(100, Math.round((xp / xpScale) * 100));
        this.xpProgress.style.width = `${percent}%`;
        this.xpProgress.setAttribute('aria-valuenow', String(percent));
        this.xpProgress.textContent = xp + " / " + xpScale;
    }

    showUpgrade(game) {
        if (game.state !== GameState.UPGRADE) {
            this.upgrade.classList.add('d-none');
        } else {
            this.upgrade.classList.remove('d-none');

            this.cards.forEach(((card, i) => {
                const up = game.tmpUpgrade[i];
                if (up === undefined) {
                    card.classList.add('d-none');
                    return;
                }
                card.querySelector('.card-title').textContent = up.title;
                card.querySelector('.card-description').textContent = up.description;
                card.querySelector('.icon i').className = `fa-solid ${up.icon}`;
            }));
        }
    }
}

//main
const canvas = document.querySelector('#game-canvas');

canvas.width = 800;
canvas.height = 600;

const input = new Input(canvas);
document.querySelectorAll('#upgrade .card').forEach((btn, i) => {
    btn.addEventListener('click', () => {
        input.actions.add('pick' + i);
    });
});

const game = new Game(input);
const renderer = new Renderer(canvas);
const ui = new UIManager();

const loop = new GameLoop((dt) => {
        game.update(dt);
        ui.update(game);
    },

    () => {
        renderer.clear();
        renderer.drawBricks(game.level.bricks);
        renderer.drawPaddle(game.paddle);
        renderer.drawBall(game.balls);
        renderer.drawOverlay(game);
        renderer.drawBullet(game.bullets);
        renderer.drawDropOuts(game.dropOuts);
    });

loop.start();