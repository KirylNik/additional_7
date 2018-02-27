module.exports = function solveSudoku(matrix) {

    let offsetX = 0; //Смещения для движения по матрице лево-прово.
    let offsetY = 0; //Смещения для движения по матрице вверх-вниз.
    let amountFullSquares = []; // Колличество заполненных квадратов.
    let workArray = createWorkArray(matrix);
    let count = 0;

    for (let i = 1; i <= 9; i++) {  //Цикл для прохода по всем 9 квадратам.

        let positionElements = []; // Позиции нулевых элеметов каждого малого квадрата.
        let square = [];  //Массив для содержимого всех маленьких квадратов 3х3, всего 9 штук

        // Получить содежимое малого квадрата и позиции пустых элементов.
        positionElements = positionElements.concat((fillSquare(matrix, offsetX, offsetY))[1]);
        square = square.concat((fillSquare(matrix, offsetX, offsetY))[0]);

        ////////Найдём чего не хватает в каждом маленьком квадрате 3х3.
        let itemsMissing = setItemsMissing(square);  // Отсутствующие элементы будем писать сюда.

        /////////////////////////////Решаем. Ищем и устанавливаем одиночки.
        installSingles(itemsMissing, positionElements, matrix);
        findCandidates(itemsMissing, positionElements, matrix);

        if (itemsMissing.length == 0) {  //Если все элементы малого квадрата заполнены, то добавить его
            amountFullSquares.push(i); //  номер что бы потом понять что все квадраты заполнены и
        };                         // финиш.
        if (i = 9) {
            if (count < 10 && amountFullSquares.length != 9) {
                i = 0;
                count++;
            } else if (count < 10 && amountFullSquares.length == 9) {
                return (matrix);
            } else if (count = 10 && amountFullSquares.length != 9) { // Если не получилось заполнить судоку
                //обычным методом, то использовать метод скрытых кадидатов, для чего вызвать:
                superSudoku(matrix, workArray, amountFullSquares);
                if (amountFullSquares != 9) {
                    substitutionSudoku(matrix, workArray);
                }
                return (matrix);
            }
        };

        // Установить смещение, количество проходов всего цикла.
        let offset = setOffset(offsetX, offsetY);
        offsetX = offset[0];
        offsetY = offset[1];
    };
///////////////////////////////////////////////////////////////////////////////////////////
//Создаём рабочий массив для записи нандидатов каждой ячейки.
    function createWorkArray(matrix) {
        let workArray = [];
        for (let i = 0; i < matrix.length; i++) {
            workArray.push([]);
            for (let y = 0; y < matrix[i].length; y++) {
                workArray[i].push([])
            };
        };
        return (workArray);
    };
// Ищем отсутствующие в переданном массиве (квадрате, строке или столбце) элементы от 1 до 9.
    function setItemsMissing(square) {
        let itemsMissing = [];
        for (let n = 1; n <= square.length; n++) {
            if (square.indexOf(n) == -1) {
                itemsMissing.push(n);
                continue;
            } else {
                continue;
            }
        };
        return(itemsMissing);
    };
// Заносим в square содержимое очередного квадрата, в positionElements - позиции лементов
// + offsetX и + offsetY добавляет нужное спещение на каждом цикле для движения по квадратам.
    function fillSquare(matrix, offsetX, offsetY) {
        let square = [];
        let positionElements = [];
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
            };
        };
        return([square, positionElements]);
    };
////////////// Устанавливаем смещение и колество проходов всего цикла.
    function setOffset(offsetX, offsetY,) {
        if (offsetX == 6 && offsetY == 0) {  // Если конец первой строки, то перейти на начало второй.
            offsetX = 0;
            offsetY += 3;
        } else if (offsetX == 6 && offsetY == 3) { // Если конец второй строки, то перейти на начало третьей.
            offsetX = 0;
            offsetY += 3;
        } else {
            offsetX += 3;  // Иначе перейти к следующему малому квадрату текущей строки.
        };

        return ([offsetX, offsetY]);
    };

    function installSingles(itemsMissing, positionElements, matrix) {
        // Получить всю строку пустого элемента.
        for (let im = 0; im < itemsMissing.length; im++) { // Пока есть цифры для вставки.

            if (positionElements.length > 0) { // Если есть пустые элементы.

                let suitablePositions = [];

                for (let m = 0; m < positionElements.length; m++) { // Пока есть пустые элементы.

                    let string = []; // Сюда будем писать всю строку пустого элемента.
                    string = matrix[positionElements[m][1]]; // Строка нулевого (пустого) элемента.
                    let column = getColumn(matrix, positionElements, m); // Колонка элемента.

                    if (string.indexOf(itemsMissing[im]) == -1 && column.indexOf(itemsMissing[im]) == -1){
                        suitablePositions.push(positionElements[m]);
                        suitablePositions.push(m); // Если в строке и столбце такогой цифры
                    } // больше нету, то записать в 'suitablePositions' позицию для возможной записи.
                };
            };
        };
    };

    function findCandidates(itemsMissing, positionElements, matrix) {
        for (let im = 0; im < itemsMissing.length; im++) { // Пока есть цифры для вставки.

            if (positionElements.length > 0) { // Если есть пустые элементы.

                let suitablePositions = [];  // ???

                for (let m = 0; m < positionElements.length; m++) { // Пока есть пустые элементы.

                    let string = []; // Сюда будем писать всю строку пустого элемента.
                    string = matrix[positionElements[m][1]]; // Строка нулевого (пустого) элемента.
                    let column = getColumn(matrix, positionElements, m); // Колонка элемента.

                    if (string.indexOf(itemsMissing[im]) == -1 && column.indexOf(itemsMissing[im]) == -1){
                        workArray[ positionElements[m][1]][positionElements[m][0] ].push(itemsMissing[im])
                        // Если в строке и столбце такогой цифры
                    } // больше нету, то записать в 'suitablePositions' позицию для возможной записи.
                };
            };
        };
    };
    // Получить колонку.
    function getColumn(matrix, positionElements, m) {
        let column = [];
        for (let ma = 0; ma < matrix.length; ma++) {
            column.push(matrix[ma][positionElements[m][0]]); // Столбец нулевого (пустого) элемента.
        };
        return(column);
    }

    return([matrix, workArray]);
////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////SUPER_SUDOKU////////////Ставим скрыте одиночки/////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
    function superSudoku(matrix, workArray) {

        for (let ss = 0; ss < 3; ss++) {  // Выполнить цикл 3 раза

            let offsetX = 0; //Смещения для движения по матрице лево-прово.
            let offsetY = 0; //Смещения для движения по матрице вверх-вниз.
            let amountFullSquares = []; // Колличество заполненных квадратов.

            for (let i = 1; i <= 9; i++) {  //Цикл для прохода по всем 9 квадратам.

                let positionElements = []; // Позиции нулевых элеметов каждого малого квадрата.
                let square = [];  //Массив для содержимого всех маленьких квадратов 3х3, всего 9 штук

                // Получить содежимое малого квадрата и позиции пустых элементов.
                positionElements = positionElements.concat((fillSquare(matrix, offsetX, offsetY))[1]);
                square = square.concat((fillSquare(matrix, offsetX, offsetY))[0]);

                ////////Найдём чего не хватает в каждом маленьком квадрате 3х3.
                let itemsMissing = setItemsMissing(square);  // Отсутствующие элементы будем писать сюда.

/////////////////////////////Решаем. Ищем и устанавливаем одиночки.
                installHiddenSingles(itemsMissing, positionElements, matrix, workArray);

                if (itemsMissing.length == 0) {  //Если все элементы малого квадрата заполнены, то добавить его
                    amountFullSquares.push(ss); //  номер что бы потом понять что все квадраты заполнены и
                };                         // финиш.

                // Установить смещение, количество проходов всего цикла.
                let offset = setOffset(offsetX, offsetY);
                offsetX = offset[0];
                offsetY = offset[1];
            };

///////////////////////////////////////////////////////////////////////////////////////////
// Ищем отсутствующие в переданном массиве (квадрате, строке или столбце) элементы от 1 до 9..
            function setItemsMissing(square) {
                let itemsMissing = [];
                for (let n = 1; n <= square.length; n++) {
                    if (square.indexOf(n) == -1) {
                        itemsMissing.push(n);
                        continue;
                    } else {
                        continue;
                    }
                };
                return(itemsMissing);
            };
// Заносим в square содержимое очередного квадрата, в positionElements - позиции лементов
// + offsetX и + offsetY добавляет нужное спещение на каждом цикле для движения по квадратам.
            function fillSquare(matrix, offsetX, offsetY) {
                let square = [];
                let positionElements = [];
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
                    };
                };
                return([square, positionElements]);
            };
////////////// Устанавливаем смещение и колество проходов всего цикла.
            function setOffset(offsetX, offsetY,) {
                if (offsetX == 6 && offsetY == 0) {  // Если конец первой строки, то перейти на начало второй.
                    offsetX = 0;
                    offsetY += 3;
                } else if (offsetX == 6 && offsetY == 3) { // Если конец второй строки, то перейти на начало третьей.
                    offsetX = 0;
                    offsetY += 3;
                } else {
                    offsetX += 3;  // Иначе перейти к следующему малому квадрату текущей строки.
                };

                return ([offsetX, offsetY]);
            };

            // Устанавливаем скрытых одиночек:
            function installHiddenSingles(itemsMissing, positionElements, matrix, workArray) {
                for (let m = 0; m < positionElements.length; m++) { // Пока есть пустые элементы.  !!!!!!!!!!!!!!
                    //!!! Создаёт уникальную коллекцию кандидатов строки 'm'.
//      if (positionElements[m][0] == 3 && positionElements[m][1] == 8) {
                    //       debugger;
                    //    }
                    let stringCandidates = []; // Все кандидаты строки.
                    for (let i = 0; i < 9; i++) { // Цикл создаёт уникальную коллекцию кандидатов строки 'm'.
                        if (i != positionElements[m][0]) {
                            let cellCandidates = [];
                            if (workArray[positionElements[m][1]][i].length != 0) {
                                cellCandidates = cellCandidates.concat(workArray[positionElements[m][1]][i]);
                                for (let y = 0; y < cellCandidates.length; y++) {
                                    if (stringCandidates.indexOf(cellCandidates[y]) == -1) {
                                        stringCandidates = stringCandidates.concat(cellCandidates[y]);
                                    };
                                };
                            };
                        };
                    };
                    //!!! Создаёт уникальную коллекцию кандидатов столбца 'm'.
                    let columnCandidates = []; // Все кандидаты столбца.
                    for (let i = 0; i < 9; i++) { // Цикл создаёт уникальную коллекцию кандидатов столбца 'm'.
                        if (i != positionElements[m][1]) {
                            let cellCandidates = []; // Тут будем накапливать кандидатов.
                            if (workArray[i][positionElements[m][0]].length != 0) {
                                cellCandidates = cellCandidates.concat(workArray[i][positionElements[m][0]]);
                                for (let y = 0; y < cellCandidates.length; y++) { //Отсеиваем повторяющиеся кандаты.
                                    if (columnCandidates.indexOf(cellCandidates[y]) == -1) {
                                        columnCandidates = columnCandidates.concat(cellCandidates[y]);
                                    };
                                };
                            };
                        };
                    };
                    //!!! Создаёт уникальную коллекцию кандидатов квадрата 3x3 в котором находтся ячейка'm'.

                    let squareCandidates = []; // Все кандидаты квадрата.
                    let offsetXtemp = 0;
                    let offsetYtemp = 0;
                    // Анализирум позицию элемента, что бы установить начальное смещение для малого квадрата.
                    if (positionElements[m][0] >= 6) {
                        offsetXtemp = 6;
                    } else if (2 < positionElements[m][0] && positionElements[m][0] < 6) {
                        offsetXtemp = 3;
                    } else {
                        offsetXtemp = 0;
                    }
                    if (positionElements[m][1] >= 6) {
                        offsetYtemp = 6;
                    } else if (2 < positionElements[m][1] && positionElements[m][1] < 6) {
                        offsetYtemp = 3;
                    } else {
                        offsetYtemp = 0;
                    }

                    for (let i = 0; i < 9; i++) { // Цикл создаёт уникальную коллекцию кандидатов квадрата 'm'.

                        if (offsetXtemp != positionElements[m][0] || offsetYtemp != positionElements[m][1]) {
                            let cellCandidates = []; // Тут будем накапливать кандидатов.
                            if (workArray[offsetYtemp][offsetXtemp].length != 0) {
                                cellCandidates = cellCandidates.concat(workArray[offsetYtemp][offsetXtemp]);
                                for (let y = 0; y < cellCandidates.length; y++) { //Отсеиваем повторяющиеся кандаты.
                                    if (squareCandidates.indexOf(cellCandidates[y]) == -1) {
                                        squareCandidates = squareCandidates.concat(cellCandidates[y]);
                                    };
                                };
                            };
                        };

                        // Смещение при анализе малого квадрата.
                        if (i == 2 || i == 5) {
                            offsetXtemp = offsetXtemp - 2;
                            offsetYtemp += 1;
                        } else {
                            offsetXtemp++;
                        };
                    };



                    // Проверка, не является ли однин из кандидатов в ячейке уникальным для строки, столбца или квадрата.


                    // //Если всего один элемент
                    if (workArray[positionElements[m][1]][positionElements[m][0]].length == 1){//Если всего один элемент
                        matrix[positionElements[m][1]] [positionElements[m][0]] =
                            workArray[positionElements[m][1]][positionElements[m][0]][0];
                        deleteCandidates(positionElements[m], workArray[positionElements[m][1]][positionElements[m][0]][0], workArray); // Записать кандидата
                        // в matrix, а остальные кандидаты удалить из строки, столбца и квадрата и закончить этот цикл.
                    }  else {


                        for (let i = 0; i < workArray[positionElements[m][1]][positionElements[m][0]].length; i++) {
                            if (stringCandidates.indexOf(workArray[positionElements[m][1]][positionElements[m][0]][i]) == -1 ||
                                columnCandidates.indexOf(workArray[positionElements[m][1]][positionElements[m][0]][i]) == -1 ||
                                squareCandidates.indexOf(workArray[positionElements[m][1]][positionElements[m][0]][i]) == -1 ){//Если явлется уникальным хотя бля чего-то одного, то:
                                matrix[positionElements[m][1]] [positionElements[m][0]] =
                                    workArray[positionElements[m][1]][positionElements[m][0]][i];
                                deleteCandidates(positionElements[m], workArray[positionElements[m][1]][positionElements[m][0]][i], workArray); // Записать кандидата
                                // в matrix, а остальные кандидаты удалить из строки, столбца и квадрата и закончить этот цикл.
                                break;
                            };
                        };
                    };
                };
            };

            function deleteCandidates(positionElements, itemsMissing, workArray) {

                //Удаляем индексы в строке.
                for (let i = 0; i < 9; i++) { // Перебераем все 9 ячеек строки.
                    if (i != positionElements[0]) { // Если это не сама ячейка, то:
                        if (workArray[positionElements[1]][i].indexOf(itemsMissing) != -1) {
                            let deleteIndex = workArray[positionElements[1]][i].indexOf(itemsMissing);
                            workArray[positionElements[1]][i].splice(deleteIndex, 1);
                        }
                    } else if (i == positionElements[0]) { // если это сама ячейка то, удалить в ней все индексы.
                        workArray[positionElements[1]][i].length = 0;
                    };
                };
                //Удаляем индексы в столбце.
                for (let i = 0; i < 9; i++) { // Перебераем все 9 ячеек столбца.
                    if (i != positionElements[1]) { // Если это не сама ячейка, то:
                        if (workArray[i][positionElements[0]].indexOf(itemsMissing) != -1) {
                            let deleteIndex = workArray[i][positionElements[0]].indexOf(itemsMissing);
                            workArray[i][positionElements[0]].splice(deleteIndex, 1);
                        }
                    } else if (i == positionElements[1]) { // если это сама ячейка то, удалить в ней все индексы.
                        workArray[i][positionElements[0]].length = 0;
                    };
                };
                //Удаляем индексы в малом квадрате.
                let offsetXtemp = 0;
                let offsetYtemp = 0;
                // Анализирум позицию элемента, что бы установить начальное смещение для малого квадрата.
                if (positionElements[0] >= 6) {
                    offsetXtemp = 6;
                } else if (2 < positionElements[0] && positionElements[0] < 6) {
                    offsetXtemp = 3;
                } else {
                    offsetXtemp = 0;
                }
                if (positionElements[1] >= 6) {
                    offsetYtemp = 6;
                } else if (2 < positionElements[1] && positionElements[1] < 6) {
                    offsetYtemp = 3;
                } else {
                    offsetYtemp = 0;
                }
                // Перебераем все 9 ячеек малого квадрата.
                for (let i = 0; i < 9; i++) { // Цикл создаёт уникальную коллекцию кандидатов квадрата 'm'.

                    if (offsetXtemp != positionElements[0] || offsetYtemp != positionElements[1]) {
                        if (workArray[offsetYtemp][offsetXtemp].indexOf(itemsMissing) != -1) {
                            let deleteIndex = workArray[offsetYtemp][offsetXtemp].indexOf(itemsMissing);
                            workArray[offsetYtemp][offsetXtemp].splice(deleteIndex, 1);
                        }
                    } else if (offsetXtemp == positionElements[0] && offsetYtemp == positionElements[1]){
                        workArray[offsetYtemp][offsetXtemp].length = 0;
                    }
                    // Смещение при анализе малого квадрата.
                    if (i == 2 || i == 5) {
                        offsetXtemp = offsetXtemp - 2;
                        offsetYtemp += 1;
                    } else {
                        offsetXtemp++;
                    };
                };
            };
////////////////////////////////////////////////////////////////

            return(matrix);
        };
    };
    // Функция, которая устанавдивает в перый пустойэлемент возможные кандидаты и смотрит, заполится ли судоку.
    function substitutionSudoku(matrix, workArray) {
        let emptyPosition = []; // Позиция пустого элемента.
        let backupCandidates = []; // Резервная копия кандидатов.
        let backupMatrix = []; // Резервная копия кандидатов.
        for (let i = 0; i < workArray.length; i++) {
            for (let y = 0; y < workArray[i].length; y++) {
                if (workArray[i][y].length != 0) {
                    emptyPosition.push(i); // Позиция пустого элемента по оси X.
                    emptyPosition.push(y); // Позиция пустого элемента по оси Y.

                    for (let z = 0; z < workArray[i][y].length; z++) { // Для всех кандидатов пустого элемента.
                        backupMatrix = matrix.slice(); // Сделали бэкап кандидатов.
                        if (matrix[1][0] == 8) {z=1} else if (matrix[2][0] == 7) {z=1};
                        matrix[i][y] = workArray[i][y][z]; // Установили в пустую ячейку кандидата.
                        backupCandidates = workArray.slice(); // Сделали бэкап кандидатов.
                        deleteCandidates([y, i], workArray[i][y][z], workArray) // Удаляем кандидаты в элементах.
                        superSudoku (matrix, workArray);
                        let fullFlag = 1;
                        for (let ms = 0; ms < 9; ms++) {
                            for (let me = 0; me < 9; me++) {
                                if (matrix[ms][me] == 0) {
                                    fullFlag = 0;
                                }
                            };
                        };
                        if (fullFlag == 0) {
                            console.log(matrix);
                            matrix = backupMatrix.slice();
                            workArray = backupCandidates.slice();
                        } else if (fullFlag == 1) {


                            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                            break;
                        }

                    }
                }
            }
        }

        function deleteCandidates(positionElements, itemsMissing, workArray) {

            //Удаляем индексы в строке.
            for (let i = 0; i < 9; i++) { // Перебераем все 9 ячеек строки.
                if (i != positionElements[0]) { // Если это не сама ячейка, то:
                    if (workArray[positionElements[1]][i].indexOf(itemsMissing) != -1) {
                        let deleteIndex = workArray[positionElements[1]][i].indexOf(itemsMissing);
                        workArray[positionElements[1]][i].splice(deleteIndex, 1);
                    }
                } else if (i == positionElements[0]) { // если это сама ячейка то, удалить в ней все индексы.
                    workArray[positionElements[1]][i].length = 0;
                };
            };
            //Удаляем индексы в столбце.
            for (let i = 0; i < 9; i++) { // Перебераем все 9 ячеек столбца.
                if (i != positionElements[1]) { // Если это не сама ячейка, то:
                    if (workArray[i][positionElements[0]].indexOf(itemsMissing) != -1) {
                        let deleteIndex = workArray[i][positionElements[0]].indexOf(itemsMissing);
                        workArray[i][positionElements[0]].splice(deleteIndex, 1);
                    }
                } else if (i == positionElements[1]) { // если это сама ячейка то, удалить в ней все индексы.
                    workArray[i][positionElements[0]].length = 0;
                };
            };
            //Удаляем индексы в малом квадрате.
            let offsetXtemp = 0;
            let offsetYtemp = 0;
            // Анализирум позицию элемента, что бы установить начальное смещение для малого квадрата.
            if (positionElements[0] >= 6) {
                offsetXtemp = 6;
            } else if (2 < positionElements[0] && positionElements[0] < 6) {
                offsetXtemp = 3;
            } else {
                offsetXtemp = 0;
            }
            if (positionElements[1] >= 6) {
                offsetYtemp = 6;
            } else if (2 < positionElements[1] && positionElements[1] < 6) {
                offsetYtemp = 3;
            } else {
                offsetYtemp = 0;
            }
            // Перебераем все 9 ячеек малого квадрата.
            for (let i = 0; i < 9; i++) { // Цикл создаёт уникальную коллекцию кандидатов квадрата 'm'.

                if (offsetXtemp != positionElements[0] || offsetYtemp != positionElements[1]) {
                    if (workArray[offsetYtemp][offsetXtemp].indexOf(itemsMissing) != -1) {
                        let deleteIndex = workArray[offsetYtemp][offsetXtemp].indexOf(itemsMissing);
                        workArray[offsetYtemp][offsetXtemp].splice(deleteIndex, 1);
                    }
                } else if (offsetXtemp == positionElements[0] && offsetYtemp == positionElements[1]){
                    workArray[offsetYtemp][offsetXtemp].length = 0;
                }
                // Смещение при анализе малого квадрата.
                if (i == 2 || i == 5) {
                    offsetXtemp = offsetXtemp - 2;
                    offsetYtemp += 1;
                } else {
                    offsetXtemp++;
                };
            };
        };

    };

};