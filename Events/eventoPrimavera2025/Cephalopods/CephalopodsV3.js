// ======== Versión 3 - Soluciona de 1 a 4 ==============

// const MOD = 1 << 30; // 2^30 = 1,073,741,824
// const TAMANO = 3;
// const TOTAL_CELDAS = TAMANO * TAMANO;

// function tableroAHash(tablero) {
//     return parseInt(tablero.join(''), 10);
// }

// function obtenerAdyacentes(indice) {
//     const fila = Math.floor(indice / TAMANO);
//     const col = indice % TAMANO;
//     const ady = [];
//     if (fila > 0) ady.push(indice - TAMANO); // Arriba
//     if (col > 0) ady.push(indice - 1);       // Izquierda
//     if (col < TAMANO - 1) ady.push(indice + 1); // Derecha
//     if (fila < TAMANO - 1) ady.push(indice + TAMANO); // Abajo
//     return ady;
// }

// function obtenerCombinacionesCaptura(tablero, indicesAdy) {
//     const valores = indicesAdy.map(idx => ({ val: tablero[idx], idx }));
//     const n = valores.length;
//     const combinaciones = [];
//     for (let mascara = 3; mascara < (1 << n); mascara++) { // Al menos 2 bits
//         if (!(mascara & (mascara - 1))) continue; // Saltar máscaras de un solo bit
//         let suma = 0;
//         let indices = [];
//         for (let i = 0; i < n; i++) {
//             if (mascara & (1 << i)) {
//                 if (valores[i].val === 0) {
//                     suma = 7; // Invalidar si está vacío
//                     break;
//                 }
//                 suma += valores[i].val;
//                 indices.push(valores[i].idx);
//             }
//         }
//         if (suma <= 6 && indices.length >= 2) {
//             combinaciones.push({ suma, indices });
//         }
//     }
//     return combinaciones;
// }

// function simular(tablero, turnosRestantes, contador = { total: 0 }) {
//     if (turnosRestantes === 0) {
//         const hash = tableroAHash(tablero);
        
//         contador.total++;
//         return hash % MOD;
//     }

//     let sumaTotal = 0;
//     const celdasVacias = [];
//     for (let i = 0; i < TOTAL_CELDAS; i++) {
//         if (tablero[i] === 0) celdasVacias.push(i);
//     }

//     if (celdasVacias.length === 0) {
//         return 0; // No hay movimientos posibles
//     }

//     const turnoActual = 4 - turnosRestantes + 1;
    
//     let ramasTurno = 0;

//     for (const pos of celdasVacias) {
//         const ady = obtenerAdyacentes(pos);
//         const capturas = obtenerCombinacionesCaptura(tablero, ady);
        
//         if (capturas.length > 0) {
//             for (const { suma, indices } of capturas) {
//                 const nuevoTablero = [...tablero];
//                 nuevoTablero[pos] = suma;
//                 for (const idx of indices) nuevoTablero[idx] = 0;
                
//                 sumaTotal = (sumaTotal + simular(nuevoTablero, turnosRestantes - 1, contador)) % MOD;
//                 ramasTurno++;
//             }
//         } else {
//             const nuevoTablero = [...tablero];
//             nuevoTablero[pos] = 1;
            
//             sumaTotal = (sumaTotal + simular(nuevoTablero, turnosRestantes - 1, contador)) % MOD;
//             ramasTurno++;
//         }
//     }

//     return sumaTotal;
// }

// function resolver(profundidad, tableroInicial) {
//     const conteoVacias = tableroInicial.filter(celda => celda === 0).length;
//     const turnosAjustados = Math.min(profundidad, conteoVacias);
   

//     const contador = { total: 0 };
//     const resultado = simular(tableroInicial, turnosAjustados, contador);
   
//     return resultado;
// }

// // Lectura de entrada para Codingame
// const depth = 8;
// const tablero = [6, 0, 6, 0, 0, 0, 6, 1, 5];

// console.log(resolver(depth, tablero));





const MOD = 1 << 30;
const TAMANO = 3;
const TOTAL_CELDAS = TAMANO * TAMANO;

function tableroAHash(tablero) {
    // Convertir a cadena directamente para preservar ceros
    return tablero.join('');
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
    for (let mascara = 1; mascara < (1 << n); mascara++) {
        let suma = 0;
        let indices = [];
        let count = 0;
        for (let i = 0; i < n; i++) {
            if (mascara & (1 << i)) {
                if (valores[i].val === 0) {
                    suma = 7; // Invalidar si está vacío
                    break;
                }
                suma += valores[i].val;
                indices.push(valores[i].idx);
                count++;
            }
        }
        if (suma <= 6 && count >= 2) {
            combinaciones.push({ suma, indices });
        }
    }
    return combinaciones;
}

function simular(tablero, turnosRestantes, estadosUnicos) {
    if (turnosRestantes === 0) {
        const hash = tableroAHash(tablero);
        estadosUnicos.add(hash);
        return;
    }

    const celdasVacias = [];
    for (let i = 0; i < TOTAL_CELDAS; i++) {
        if (tablero[i] === 0) celdasVacias.push(i);
    }

    if (celdasVacias.length === 0) {
        const hash = tableroAHash(tablero);
        estadosUnicos.add(hash);
        return;
    }

    for (const pos of celdasVacias) {
        const ady = obtenerAdyacentes(pos);
        const capturas = obtenerCombinacionesCaptura(tablero, ady);

        for (const { suma, indices } of capturas) {
            const nuevoTablero = [...tablero];
            nuevoTablero[pos] = suma;
            for (const idx of indices) nuevoTablero[idx] = 0;
            simular(nuevoTablero, turnosRestantes - 1, estadosUnicos);
        }

        const nuevoTablero = [...tablero];
        nuevoTablero[pos] = 1;
        simular(nuevoTablero, turnosRestantes - 1, estadosUnicos);
    }
}

function resolver(profundidad, tableroInicial) {
    const estadosUnicos = new Set();
    simular(tableroInicial, profundidad, estadosUnicos);

    let sumaTotal = 0;
    for (const estadoStr of estadosUnicos) {
        // Convertir la cadena a número, preservando ceros iniciales en la unicidad
        const numero = parseInt(estadoStr, 10);
        sumaTotal = (sumaTotal + numero) % MOD;
    }

    console.error(`Total estados finales: ${estadosUnicos.size}`);
    return sumaTotal;
}

// Lectura de entrada para Codingame
const profundidad = 32;
const tablero = [0, 0, 0, 0, 5, 4, 1, 0, 5];

console.log(resolver(profundidad, tablero));