export function useSnackbar() {
  const showSnackbar = (options: { text: string; color?: string }) => {
    console.info(`Snack: ${options.text}`);
  };

  return { showSnackbar };
}