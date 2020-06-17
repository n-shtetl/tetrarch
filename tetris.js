window.onload = function() {
    const canvas = document.getElementById('tetris');
    const context = canvas.getContext('2d');
    let color;
    const background = document.getElementById('basil');
    const redTet = document.getElementById('red-tet');
    const purpleTet = document.getElementById('purple-tet');
    const babyTet = document.getElementById('baby-tet');
    const yellowTet = document.getElementById('yellow-tet');
    const greenTet = document.getElementById('green-tet');
    const orangeTet = document.getElementById('orange-tet');
    const pinkTet = document.getElementById('pink-tet');
    
    const audio = document.getElementById('player');
    audio.volume = 0.1;

    context.scale(20, 20);

    function createPiece(type) {
        if (type === 'T') {
            color = redTet;;
            return [
                [0,0,0],
                [1,1,1],
                [0,1,0],
            ]
        } else if (type === 'L') {
            color = orangeTet;
            return [
                [0,1,0],
                [0,1,0],
                [0,1,1]
            ]
        } else if (type === 'O') {
            color = yellowTet;
            return [
                [1,1],
                [1,1]
            ]
        } else if (type === 'Z') {
            color = greenTet;
            return [
                [0,0,0],
                [1,1,0],
                [0,1,1]
            ]
        } else if (type === 'S') {
            color = purpleTet;
            return [
                [0,0,0],
                [0,1,1],
                [1,1,0]
            ]
        } else if (type === 'J') {
            color = pinkTet;
            return [
                [0,1,0],
                [0,1,0],
                [1,1,0]
            ]
        } else if (type === 'I') {
            color = babyTet;
            return [
                [0,1,0,0],
                [0,1,0,0],
                [0,1,0,0],
                [0,1,0,0]
            ]
        }
    }

    function collide(arena, player) {
        const [m, o] = [player.matrix, player.pos];
        for (let y = 0; y < m.length; y++) {
            for (let x = 0; x < m[y].length; x++) {
                if (m[y][x] !== 0 && 
                    (arena[y+o.y] &&
                    arena[y+o.y][x+o.x]) !== 0) {
                        return true;
                    }   
            }
        }
        return false;
    }

    function createMatrix(w, h) {
        const matrix = [];
        while (h--) {
            matrix.push(new Array(w).fill(0))
        }
        return matrix;
    }

    function merge(arena, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    arena[y + player.pos.y][x + player.pos.x] = value;
                }
            })
        })
    }

    function playerReset() {
       const pieces = "ILJOTZS";
       player.matrix = createPiece(pieces[pieces.length * Math.random() | 0])
       player.pos.y = 0;
       player.pos.x = Math.floor(arena[0].length / 2) - 
                      Math.floor(player.matrix[0].length / 2)
       if (collide(arena, player)) {
           arena.forEach(row => row.fill(0));
       }
    }

    function draw() {
        // context.fillStyle = '#000';
        // context.fillRect(0,0, canvas.width, canvas.height);
        // if (typeof background !== null) {
        //     context.drawImage(background, 0, 0);
        // }
        context.drawImage(background, 0, 0, 12, 20);
        drawMatrix(arena, { x: 0, y: 0 })
        drawMatrix(player.matrix, player.pos);
    }

    function drawMatrix(matrix, offset) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    // context.fillStyle = 'blue';
                    // context.fillRect(x + offset.x, 
                    //                 y + offset.y,
                    //                 1, 1);
                    context.drawImage(color, x + offset.x, y + offset.y, 1, 1)
                    
                }
            });
        });
    }

    function playerDrop() {
        player.pos.y++;
        if (collide(arena, player)) {
            player.pos.y--;
            merge(arena, player);
            playerReset();
        }
        dropCounter = 0;
    }

    function rotate(matrix, dir) {
        for (let y = 0; y < matrix.length; y++) {
            for (let x = 0; x < y; x++) {
                [
                    matrix[x][y],
                    matrix[y][x]
                ] = [
                    matrix[y][x],
                    matrix[x][y]
                ];
            }
        }
        if (dir > 0) {
            matrix.forEach(row => row.reverse())
        } 
    }

    function playerRotate(dir) {
        const pos = player.pos.x;
        let offset = 1;
        rotate(player.matrix, dir);
        while (collide(arena, player)) {
            player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1))
            if (offset > player.matrix[0].length) {
                rotate(player.matrix, -dir);
                player.pos.x = pos;
                return;
            }
        }
    }

    function playerMove(dir) {
        player.pos.x += dir;
        if (collide(arena, player)) {
            player.pos.x -= dir;
        }
    }


    let dropCounter = 0;
    let dropInterval = 1000;

    let lastTime = 0;

    function update(time = 0) {
        const deltaTime = time - lastTime;
        lastTime = time;

        dropCounter += deltaTime;
        if (dropCounter > dropInterval) {
            playerDrop();
        }
        draw();
        requestAnimationFrame(update);
    }

    const arena = createMatrix(12, 20);

    const player = {
        pos: {x: 0, y: 0},
        matrix: createPiece('I'),
    }

    document.addEventListener('keydown', event => {
        if (event.keyCode === 37) {
            playerMove(-1);
        } else if (event.keyCode === 39) {
            playerMove(1);
        } else if (event.keyCode === 40) {
            playerDrop();
        } else if (event.keyCode === 38) {
            playerRotate(1)
        }
    })

    update();
}
