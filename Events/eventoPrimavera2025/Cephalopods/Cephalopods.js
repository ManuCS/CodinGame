let valoresIniciales = [
    0, 6, 0, 
    2, 2, 2, 
    1, 6, 1
]
const depth = 32;
const MOD = 1 << 30; // 2^30 para evitar overflow
const TOTAL_CELDAS = valoresIniciales.length; // la cantidad de celdas es 9
const TAMANO_TABLERO = 3; // el tablero es de 3x3

// Esta función convierte el tablero en un hash
// Cada celda tiene un valor entre 0 y 6, por lo que el hash puede ser un número de <=9 dígitos
// Por ejemplo, el tablero [0, 6, 0, 2, 2, 2, 1, 6, 1] se convierte en el hash 62022161
// La función recorre el tablero y va multiplicando el hash por 10 y sumando el valor de la celda actual
// Al final, devuelve el hash
// el has será un número único para cada tablero, para que no se repita
// esto es útil para guardar los tableros ya visitados y no volver a calcularlos
// el objetivo es sumar los hashes de todos los estados posibles después de un número dado de turnos.
function tableroAHash(tablero) {    
    let hash = 0;
    for (let i = 0; i < TOTAL_CELDAS; i++) {
        hash = (hash * 10) + tablero[i];
    }
    return hash;
}

// Voy a implementar una funcion para obtener los adyacentes de una posicion dada
function obtenerAdyacentes(posicion) {
    //Divido la posicion dada entre 3 y redondeo a la baja para obtener a qué fila pertenece 
    // Ya que el tablero es de 3x3, la fila debe ser 0, 1 o 2
    const fila = Math.floor(posicion / TAMANO_TABLERO);

    // La columna se obtiene con el resto de la división entre 3
    // Ya que el tablero es de 3x3, la columna debe ser 0, 1 o 2
    const columna = posicion % TAMANO_TABLERO;

    // En este array voy a añadir las posiciones adyacentes
    const adyacentes = [];
    
    // Para cada posición, voy a comprobar si existe una celda adyacente

    // Si la fila es mayor que 0 (1 o 2), debe tener una posicion adyacente arriba:
    // Arriba
    if (fila > 0) {
        // Le resto 3 a la posicion para obtener la celda de arriba
        adyacentes.push(posicion - TAMANO_TABLERO);
    }

    // Si la fila es menor que 2 (0 o 1), debe tener una posicion adyacente abajo:
    // Abajo
    if(fila < 2){
        // Le sumo 3 a la posicion para obtener la celda de abajo
        adyacentes.push(posicion + TAMANO_TABLERO);
    }

    // Ahora vamos con los adyacentes laterales:

    // Si la columna es mayor que 0 (1 o 2), debe tener una posicion adyacente a la izquierda:
    // Izquierda
    if(columna > 0){
        // Le resto 1 a la posicion para obtener la celda de la izquierda
        adyacentes.push(posicion - 1);
    }

    // Si la columna es menor que 2 (0 o 1), debe tener una posicion adyacente a la derecha:
    // Derecha
    if(columna < 2){
        // Le sumo 1 a la posicion para obtener la celda de la Derecha
        adyacentes.push(posicion + 1);
    }

    // devuelvo el array con las celdas adyacentes
    return adyacentes;
}


// Implementamos una función para obtener las diferentes combinaciones para capturar
// Recibimos 2 parámetros: tablero y adyacentes, que es un array con las posiciones de los adyacentes
function obtenerCombinacionesCaptura(tablero, adyacentes) {
    // Iniciamos el array de las combinaciones
    const combinaciones = [];
    
    // Utilizamos RECURSION para generar las diferentes combinaciones que tenemos en base a la posición y 
    // que sumen menos o igual a 6
    // Parámetros:
        // -inicio: es el índice del array adyacentes desde donde empezaremos a considerar elementos (para no repetir combinaciones)
        // -sumaActual: la suma de los valores de los dados que hemos seleccionado hasta ahora
        // -indicesActual: array con los índices de los dados utilizados para la suma actual
    function generarCombinaciones(inicio, sumaActual, indicesActual) {

        // Si la sumaActual es mayor que 6, detiene la ejecución para esa llamada y para que no se incluyan combinaciones no validas
        if (sumaActual > 6) return;

        // si la longitud de indices es mayor que 0, hacemos push de la suma y de los índices que 
        // forman esa suma
        if (indicesActual.length > 0) {
            combinaciones.push({ suma: sumaActual, indices: [...indicesActual] });
        }
        
        // hacemos un bucle con una llamada recursiva a esta función para que vaya calculando la suma actual y los índices de los adyacentes
        for (let i = inicio; i < adyacentes.length; i++) {
            const nuevoValor = tablero[adyacentes[i]];
            generarCombinaciones(i + 1, sumaActual + nuevoValor, [...indicesActual, adyacentes[i]]);
        }
    }
    
    // inicializamos la recursión de la función
    generarCombinaciones(0, 0, []);

    // devolvemos el array de objetos con las combinaciones posibles
    return combinaciones;
}

// simula todos los estados posibles del juego y calcula la suma de sus hashes
// Recibe el tablero inicial y el número de turnos restantes
// Utiliza memorización para optimizar el rendimiento
// La función utiliza un map para almacenar los resultados de los estados ya calculados y así evitar cálculos repetidos
// La clave del map es una cadena que representa el estado del tablero y los turnos restantes
// Devuelve la suma total de los hashes de todos los estados posibles después de un número dado de turnos
// Esta funcion es recursiva y se llama a sí misma para cada posible movimiento
function simular(tablero, turnosRestantes, memoria = new Map()) {

    // Creo una clave para el estado actual del tablero, convirtiendo el array de tablero en string
    // separado por "," de los turnos restantes
    const claveEstado = `${tablero.join('')},${turnosRestantes}`;
    // Si el estado ya ha sido calculado, devuelvo el resultado almacenado en memoria, para así no estar calculando repetidos
    // Esto es útil para optimizar el rendimiento y evitar cálculos innecesarios
    if (memoria.has(claveEstado)) return memoria.get(claveEstado);
    
    // casillasVacias es la cantidad de celdas vacías en el tablero
    const casillasVacias = tablero.filter(x => x === 0).length;
    
    // si no hay turnos restantes o no hay celdas vacías, devuelvo el hash del tablero
    // Entonces, habríamos llegado al final del juego y la simulación termina
    // Devuelvo el Hash como resultado y fin del juego
    if (turnosRestantes === 0 || casillasVacias === 0) {
        return tableroAHash(tablero);
    }
    
    // inicializo la variable sumaTotal a 0, que se usará para almacenar la suma de los hashes de todos los estados posibles
    // que se generen a partir del tablero actual
    // La variable sumaTotal se va a ir acumulando con los resultados de cada movimiento
    // y al final se devuelve como resultado de la función
    let sumaTotal = 0;
    
    // Recorro todas las posiciones del tablero
    for (let pos = 0; pos < TOTAL_CELDAS; pos++) {
        // Si la celda está ocupada (no es 0), continúo con la siguiente iteración
        // Esto es para evitar que se intente jugar en una celda que ya tiene un valor
        if (tablero[pos] !== 0) continue;
        
        // Si la celda está vacía, obtengo los índices de las celdas adyacentes
        const adyacentes = obtenerAdyacentes(pos);

        // Filtramos los adyacentes para quedarnos solo con los que están ocupados (no son 0)
        const adyacentesOcupados = adyacentes.filter(idx => tablero[idx] !== 0);
        
        // Si hay al menos 2 adyacentes ocupados, obtengo las combinaciones de captura
        if (adyacentesOcupados.length >= 2) {
            // Llamo a la función para obtener las combinaciones de captura y guardo el resultado en "combinaciones"
            const combinaciones = obtenerCombinacionesCaptura(tablero, adyacentesOcupados);
            
            // Recorro las combinaciones y voy sumando los resultados de cada una, almacenando el resultado en sumaTotal
            for (const { suma, indices } of combinaciones) {
                // nuevoTablero es una copia del tablero actual
                const nuevoTablero = [...tablero];
                // Actualizo la celda actual con la suma de los adyacentes ocupados
                nuevoTablero[pos] = suma;
                // Recorro los índices de los adyacentes ocupados y los actualizo a 0
                for (const idx of indices) {
                    nuevoTablero[idx] = 0;
                }
                // Llamo a la función simular de forma recursiva para calcular el resultado del nuevo tablero
                // a los turnosRestantes le resto uno para que se vayan consumiendo los turnos
                const resultado = simular(nuevoTablero, turnosRestantes - 1, memoria);
                // Acumulo el resultado en sumaTotal
                // Utilizo el operador módulo para evitar overflow
                // y asegurarme de que el resultado no exceda el límite de 2^30
                sumaTotal = (sumaTotal + resultado) % MOD;
            }
        }
        
        // Si hay menos de 2 adyacentes ocupados, coloco un 1 en la celda actual
        if (adyacentesOcupados.length < 2) {
            // nuevoTablero es una copia del tablero actual
            const nuevoTablero = [...tablero];
            // Actualizo la celda actual a 1
            nuevoTablero[pos] = 1;

            // Llamo a la función simular de forma recursiva para calcular el resultado del nuevo tablero
            // a los turnosRestantes le resto uno para que se vayan consumiendo los turnos
            const resultado = simular(nuevoTablero, turnosRestantes - 1, memoria);
            // Acumulo el resultado en sumaTotal de nuevo
            sumaTotal = (sumaTotal + resultado) % MOD;
        }
    }
    // Al final de la función, guardo el resultado en memoria para evitar cálculos repetidos
    // La clave del map es una cadena que representa el estado del tablero(en formato String) y los turnos restantes
    memoria.set(claveEstado, sumaTotal);
    // Devuelvo la suma total de los hashes de todos los estados posibles
    // que se generen a partir del tablero actual
    return sumaTotal;
}


// Ejecutar la simulación con el tablero inicial
console.log(simular(valoresIniciales, depth));

// ================ VERSION ANTERIOR CON ERRORES ==========================







