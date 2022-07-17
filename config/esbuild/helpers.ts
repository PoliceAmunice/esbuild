import path from 'path';


export function resolveRoot(...segments: string[]): string {
  return path.resolve(__dirname, '..', '..', ...segments);
}
