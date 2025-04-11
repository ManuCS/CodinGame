// // =============== Version que corrige testcases 1-4 =======================


/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

const depth = parseInt(readline());
let valoresIniciales = [];
for (let i = 0; i < 3; i++) {
    var inputs = readline().split(' ');
    for (let j = 0; j < 3; j++) {
        const value = parseInt(inputs[j]);
        // Aqui pongo en tablero los valores que tiene inicialmente cada celda
        valoresIniciales.push(value)
    }
}

const MOD = 1 << 30; // 2^30 = 1,073,741,824
const TAMANO = 3;
const TOTAL_CELDAS = TAMANO * TAMANO;

function tableroAHash(tablero) {
    return parseInt(tablero.join(''), 10);
}

function obtenerAdyacentes(indice) {
    const fila = Math.floor(indice / TAMANO);
    const col = indice % TAMANO;
    const ady = [];
    if (fila > 0) ady.push(indice - TAMANO); // Arriba
    if (col > 0) ady.push(indice - 1);       // Izquierda
    if (col < TAMANO - 1) ady.push(indice + 1); // Derecha
    if (fila < TAMANO - 1) ady.push(indice + TAMANO); // Abajo
    return ady;
}

function obtenerCombinacionesCaptura(tablero, indicesAdy) {
    const valores = indicesAdy.map(idx => ({ val: tablero[idx], idx }));
    const n = valores.length;
    const combinaciones = [];
    for (let mascara = 3; mascara < (1 << n); mascara++) { // Al menos 2 bits
        if (!(mascara & (mascara - 1))) continue; // Saltar máscaras de un solo bit
        let suma = 0;
        let indices = [];
        for (let i = 0; i < n; i++) {
            if (mascara & (1 << i)) {
                if (valores[i].val === 0) {
                    suma = 7; // Invalidar si está vacío
                    break;
                }
                suma += valores[i].val;
                indices.push(valores[i].idx);
            }
        }
        if (suma <= 6 && indices.length >= 2) {
            combinaciones.push({ suma, indices });
        }
    }
    return combinaciones;
}

function simular(tablero, turnosRestantes, memo = new Map()) {
    const clave = `${tablero.join('')},${turnosRestantes}`;
    if (memo.has(clave)) return memo.get(clave);
    if (turnosRestantes === 0 || tablero.every(celda => celda !== 0)) {
        return tableroAHash(tablero) % MOD;
    }

    let sumaTotal = 0;
    const celdasVacias = [];
    for (let i = 0; i < TOTAL_CELDAS; i++) {
        if (tablero[i] === 0) celdasVacias.push(i);
    }

    for (const pos of celdasVacias) {
        const ady = obtenerAdyacentes(pos);
        const capturas = obtenerCombinacionesCaptura(tablero, ady);
        if (capturas.length > 0) {
            for (const { suma, indices } of capturas) {
                const nuevoTablero = [...tablero];
                nuevoTablero[pos] = suma;
                for (const idx of indices) nuevoTablero[idx] = 0;
                sumaTotal = (sumaTotal + simular(nuevoTablero, turnosRestantes - 1, memo)) % MOD;
            }
        } else {
            const nuevoTablero = [...tablero];
            nuevoTablero[pos] = 1;
            sumaTotal = (sumaTotal + simular(nuevoTablero, turnosRestantes - 1, memo)) % MOD;
        }
    }
    memo.set(clave, sumaTotal);
    return sumaTotal;
}

function resolver(profundidad, tableroInicial) {
    const conteoVacias = tableroInicial.filter(celda => celda === 0).length;
    const turnosAjustados = Math.min(profundidad, conteoVacias);

    const resultado = simular(tableroInicial, turnosAjustados);
    return resultado;
}

// Lectura de entrada para Codingame
const profundidad = parseInt(readline());
const tablero = [];
for (let i = 0; i < 3; i++) {
    tablero.push(...readline().split(' ').map(Number));
}
console.log(resolver(profundidad, tablero));