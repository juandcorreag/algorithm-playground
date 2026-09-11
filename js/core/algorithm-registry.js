const registry = new Map();

const requiredFields = ['id', 'name', 'category', 'inputType', 'pseudocode', 'supportedOperations', 'generateInput', 'execute'];

export function registerAlgorithm(definition) {
  for (const field of requiredFields) {
    if (definition?.[field] === undefined) throw new TypeError(`Algorithm definition is missing: ${field}`);
  }
  if (!/^[a-z][a-z0-9-]*$/.test(definition.id)) throw new TypeError(`Invalid algorithm id: ${definition.id}`);
  if (registry.has(definition.id)) throw new Error(`Algorithm already registered: ${definition.id}`);
  if (!Array.isArray(definition.pseudocode) || definition.pseudocode.some(line => !Number.isInteger(line.id) || !line.text)) {
    throw new TypeError(`Invalid pseudocode for: ${definition.id}`);
  }
  registry.set(definition.id, Object.freeze(definition));
  return definition;
}

export function getAlgorithm(id) {
  const definition = registry.get(id);
  if (!definition) throw new RangeError(`Unknown predefined algorithm: ${id}`);
  return definition;
}

export function listAlgorithms() {
  return [...registry.values()];
}
