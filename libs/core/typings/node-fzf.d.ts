declare module 'node-fzf' {
  function nodeFzf(options: { list: string[] }): Promise<{ selected: { index: number; value: string } | null }>;
  export = nodeFzf;
}
