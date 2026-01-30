/**
 * Converte shapefiles do PRODUTO C (Canudos) para GeoJSON
 * e grava em public/data/canudos/ com nomes esperados pelo frontend.
 *
 * Uso: node scripts/convert-canudos-shp.js
 *      ou: node scripts/convert-canudos-shp.js "C:\caminho\PRODUTO C\PRODUTO C"
 */

const path = require("path");
const fs = require("fs");
const shapefile = require("shapefile");

const INPUT_DIR = process.argv[2] || path.join("C:", "Users", "toim6", "Downloads", "PRODUTO C", "PRODUTO C");
const OUTPUT_BASE = path.join(__dirname, "..", "public", "data", "canudos");

// Mapeamento: arquivo(s) de origem -> arquivo de saída (relativo a OUTPUT_BASE)
// Para pastas com "merge: true", todos os .shp da pasta (recursivo) são unidos em um único GeoJSON.
const MAPPING = [
  // Raiz – um .geojson por .shp
  { src: "Bahia.shp", out: "Bahia.geojson" },
  { src: "Canudos.shp", out: "Canudos.geojson" },
  { src: "Mascara Canudos.shp", out: "Mascara-Canudos.geojson" },
  { src: "Sede Canudos.shp", out: "Sede-Canudos.geojson" },
  { src: "DISTRITOS CANUDOS.shp", out: "DISTRITOS-CANUDOS.geojson" },
  { src: "rodovias federais canudos.shp", out: "rodovias-federais-canudos.geojson" },
  { src: "Cor1.shp", out: "Cor1.geojson" },
  // Subpastas – um arquivo por shapefile
  { src: path.join("ALTIMETRIA", "CURVAS DE NIVEL CANUDOS.shp"), out: path.join("ALTIMETRIA", "CURVAS-DE-NIVEL-CANUDOS.geojson") },
  { src: path.join("GEOMORFOLÓGICO", "Geomorfologia Canudos.shp"), out: path.join("GEOMORFOLOGICO", "geomorfologia.geojson") },
  { src: path.join("HIDROGEOLÓGICO", "HIDROGEO CANUDOS.shp"), out: path.join("HIDROGEOLOGICO", "hidrogeologico.geojson") },
  { src: path.join("SOLOS", "solos canudos.shp"), out: path.join("SOLOS", "solos-canudos.geojson") },
  { src: path.join("VEGETAÇÃO", "VEGETACAO CANUDOS.shp"), out: path.join("VEGETACAO", "VEGETACAO-CANUDOS.geojson") },
  // Pastas que viram um único GeoJSON (merge de todos os .shp)
  { srcDir: "DRENAGEM", out: path.join("DRENAGEM", "drenagem.geojson"), merge: true },
  { srcDir: "HIDROGRAFIA", out: path.join("HIDROGRAFIA", "hidrografia.geojson"), merge: true },
  { srcDir: "EXPANSÃO URBANA", out: path.join("EXPANSAO-URBANA", "expansao-urbana.geojson"), merge: true },
  { srcDir: "LOCALIZAÇÃO COM LOCALIDADES", out: path.join("LOCALIZACAO-COM-LOCALIDADES", "localidades.geojson"), merge: true },
  { srcDir: "USO E OCUPAÇÃO DO SOLO", out: path.join("USO-E-OCUPACAO-DO-SOLO", "uso-ocupacao-solo.geojson"), merge: true },
  { srcDir: "UNIDADES DE CONSERVAÇÃO", out: path.join("UNIDADES-DE-CONSERVACAO", "unidades-conservacao.geojson"), merge: true },
];

function sanitizeFileName(name) {
  return name.replace(/\s+/g, "-").replace(/[ÀÁÂÃÄÅàáâãäå]/g, "a").replace(/[ÈÉÊËèéêë]/g, "e").replace(/[ÌÍÎÏìíîï]/g, "i").replace(/[ÒÓÔÕÖòóôõö]/g, "o").replace(/[ÙÚÛÜùúûü]/g, "u").replace(/[Çç]/g, "c");
}

function findShpFiles(dir, list = []) {
  if (!fs.existsSync(dir)) return list;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      findShpFiles(full, list);
    } else if (e.name.toLowerCase().endsWith(".shp")) {
      list.push(full);
    }
  }
  return list;
}

async function shpToGeoJSON(shpPath) {
  try {
    const result = await shapefile.read(shpPath);
    return result && result.features ? result : { type: "FeatureCollection", features: [] };
  } catch (err) {
    console.warn("  Aviso:", shpPath, err.message);
    return { type: "FeatureCollection", features: [] };
  }
}

async function convertOne(srcRel, outRel) {
  const srcPath = path.join(INPUT_DIR, srcRel);
  if (!fs.existsSync(srcPath)) {
    console.warn("Arquivo não encontrado:", srcPath);
    return;
  }
  const outPath = path.join(OUTPUT_BASE, outRel);
  const outDir = path.dirname(outPath);
  fs.mkdirSync(outDir, { recursive: true });
  const geojson = await shpToGeoJSON(srcPath);
  fs.writeFileSync(outPath, JSON.stringify(geojson), "utf8");
  console.log("OK:", outRel, "(" + (geojson.features?.length || 0) + " features)");
}

async function convertMerged(srcDirName, outRel) {
  const srcDir = path.join(INPUT_DIR, srcDirName);
  if (!fs.existsSync(srcDir)) {
    console.warn("Pasta não encontrada:", srcDir);
    return;
  }
  const shpFiles = findShpFiles(srcDir, []);
  const outPath = path.join(OUTPUT_BASE, outRel);
  const outDir = path.dirname(outPath);
  fs.mkdirSync(outDir, { recursive: true });
  const stream = fs.createWriteStream(outPath, { encoding: "utf8" });
  stream.write('{"type":"FeatureCollection","features":[');
  let totalFeatures = 0;
  let first = true;
  for (const shpPath of shpFiles) {
    const col = await shpToGeoJSON(shpPath);
    if (col.features && col.features.length) {
      for (const feature of col.features) {
        if (!first) stream.write(",");
        stream.write(JSON.stringify(feature));
        first = false;
        totalFeatures++;
      }
    }
  }
  stream.write("]}");
  stream.end();
  await new Promise((resolve, reject) => stream.on("finish", resolve).on("error", reject));
  console.log("OK (merge):", outRel, "(" + totalFeatures + " features de", shpFiles.length, "arquivos)");
}

async function run() {
  console.log("Entrada:", INPUT_DIR);
  console.log("Saída:", OUTPUT_BASE);
  console.log("");

  fs.mkdirSync(OUTPUT_BASE, { recursive: true });

  for (const m of MAPPING) {
    if (m.merge && m.srcDir) {
      await convertMerged(m.srcDir, m.out);
    } else if (m.src) {
      await convertOne(m.src, m.out);
    }
  }

  console.log("\nConversão concluída.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
