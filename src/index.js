module.exports = function solveSudoku(matrix) {

    let offsetX = 0; //Смещения для движения по матрице лево-прово.
    let offsetY = 0; //Смещения для движения по матрице вверх-вниз.
    let amountFullSquares = []; // Колличество заполненных квадратов.


    for (let i = 1; i <= 9; i++) {  //Цикл для прохода по всем 9 квадратам.


        let positionElements = []; // Позиции нулевых элеметов каждого малого квадрата.
        let square = [];  //Массив для содержимого всех маленьких квадратов 3х3, всего 9 штук
        // + offsetX и + offsetY добавляет нужное спещение на каждом цикле.
        for (let a = 0 + offsetX; a < 3 + offsetX; a++) {  // Добавить в квардат строку 1.
            square.push(matrix[0 + offsetY][a]);
            if (matrix[0 + offsetY][a] == 0) {
                positionElements.push([a, 0 + offsetY]); // Добавить координаты элемента.
            }
        }
        for (let b = 0 + offsetX; b < 3 + offsetX; b++) { // Добавить в квардат строку 2.
            square.push(matrix[1 + offsetY][b]);
            if (matrix[1 + offsetY][b] == 0) {
                positionElements.push([b, 1 + offsetY]); // Добавить координаты элемента.
            }
        }
        for (let c = 0 + offsetX; c < 3 + offsetX; c++) { // Добавить в квардат строку 3.
            square.push(matrix[2 + offsetY][c]);
            if (matrix[2 + offsetY][c] == 0) {
                positionElements.push([c, 2 + offsetY]); // Добавить координаты элемента.
            }
        }

        ////////Найдём чего не хватает в каждом маленьком квадрате 3х3.
        let itemsMissing = [];  // Отсутствующие элементы будем писать сюда.

        for (let n = 1; n <= square.length; n++) {
            if (square.indexOf(n) == -1) {
                itemsMissing.push(n);
                continue;
            } else {
                continue;
            }
        };

/////////////////////////////Решаем. Взять элемент и определить позицию.

        // Получить всю строку пустого элемента.
        for (let im = 0; im < itemsMissing.length; im++) { // Пока есть цифры для вставки.

            if (positionElements.length > 0) { // Если есть пустые элементы.

                let suitablePositions = [];

                for (let m = 0; m < positionElements.length; m++) { // Пока есть пустые элементы.

                    let string = []; // Сюда будем писать всю строку пустого элемента.
                    let column = []; // Сюда будем писать весь столбец пустого элемента.
                    string = matrix[positionElements[m][1]]; // Строка нулевого (пустого) элемента.

                    for (let ma = 0; ma < matrix.length; ma++) {
                        column.push(matrix[ma][positionElements[m][0]]); // Столбец нулевого (пустого) элемента.
                    };

                    if (string.indexOf(itemsMissing[im]) == -1 && column.indexOf(itemsMissing[im]) == -1){
                        suitablePositions.push(positionElements[m]);
                        suitablePositions.push(m); // Если в строке и столбце такогой цифры
                    } // больше нету, то записать в 'suitablePositions' позицию для возможной записи.

                    if ((m < positionElements.length - 1) == false) { // Если пустых позиций больше нет.
                        if (suitablePositions.length == 2) {
                            matrix[suitablePositions[0][1]][suitablePositions[0][0]] = itemsMissing[im];
                            positionElements.splice(suitablePositions[1], 1);
                        }
                    } else {
                        continue;
                    }
                };
                // Сюда выйдет после проверки всех пустых мест на возможность вставки
                // очередной цифры 'itemsMissing'.

            };
        };


        if (itemsMissing == 0) {  //Если все элементы малого квадрата 3х3 заполнены, то добавить его номер,
            amountFullSquares.push(i); // что бы потом понять что все квадраты заполнены и финиш.
        }


        if (offsetX == 6 && offsetY == 0) {  // Если конец первой строки, то перейти на начало второй.
            offsetX = 0;
            offsetY += 3;
        } else if (offsetX == 6 && offsetY == 3) { // Если конец второй строки, то перейти на начало третьей.
            offsetX = 0;
            offsetY += 3;
        } else {
            offsetX += 3;  // Иначе перейти к следующему малому квадрату текущей строки.
        }

    }
    return(matrix);

};