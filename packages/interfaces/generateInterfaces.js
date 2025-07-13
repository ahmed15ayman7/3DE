import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCHEMA_PATH = path.join(__dirname, '../shared/prisma/schema.prisma');
const OUTPUT_PATH = path.join(__dirname, './index.ts');
const scalarTypeMap = {
  String: 'string',
  Int: 'number',
  Float: 'number',
  Boolean: 'boolean',
  DateTime: 'Date',
  Json: 'any',
};

const extractBlocks = (schema, keyword) => {
  const regex = new RegExp(`${keyword}\\s+\\w+\\s+\\{[^}]+\\}`, 'g');
  return schema.match(regex) || [];
};

const extractEnums = (schema) => {
  const regex = /enum\s+(\w+)\s+\{([^}]+)\}/g;
  const enums = [];

  let match;
  while ((match = regex.exec(schema)) !== null) {
    const enumName = match[1];
    const values = match[2].trim().split(/\s+/).map(v => `'${v}'`);
    enums.push(`export type ${enumName} = ${values.join(' | ')};`);
  }

  return enums.join('\n\n');
};

const parseModel = (block) => {
  const lines = block.trim().split('\n');
  const modelName = lines[0].split(/\s+/)[1];
  const fields = lines.slice(1, -1).map(line => {
    const parts = line.trim().split(/\s+/);
    const [name, rawType, ...rest] = parts;

    // Skip relation definitions (e.g., `users User[]`)
    if (!name || !rawType) return null;

    const isOptional = rawType.endsWith('?') || rest.includes('?');
    const isArray = rawType.endsWith('[]') || rest.includes('[]');
    const baseType = rawType.replace(/[?\[\]]/g, '');
    const isRelation = !scalarTypeMap[baseType] && !rest.join(' ').includes('@default');

    const tsType = scalarTypeMap[baseType] || baseType;
    const finalType = `${tsType}${isArray ? '[]' : ''}`;

    return `  ${name}${isOptional ? '?' : ''}: ${isRelation ? `${finalType} | undefined` : finalType};`;
  }).filter(Boolean);

  return `export interface ${modelName} {\n${fields.join('\n')}\n}`;
};

const generateInterfaces = () => {
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');

  const modelBlocks = extractBlocks(schema, 'model');
  const models = modelBlocks.map(parseModel).join('\n\n');

  const enums = extractEnums(schema);

  const output = `${enums}\n\n${models}`;
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, output);

  console.log(`✅ Interfaces and enums generated at ${OUTPUT_PATH}`);
};

generateInterfaces();
