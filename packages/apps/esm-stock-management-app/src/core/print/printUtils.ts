export const printDocument = (content: string) => {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.left = '-9999px';
  iframe.srcdoc = content;
  iframe.onload = () => {
    iframe.contentWindow?.print();
    iframe.remove();
  };
  document.body.appendChild(iframe);
};
