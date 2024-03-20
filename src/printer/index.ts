// TODO: separate out printers from transformers
import { Generatable } from '../generator/helpers';
import TOCGenerator from '../generator/toc';
import ModelGenerator from '../generator/model';
import TypesGenerator from '../generator/apitypes';
import { DMMFDocument } from '../generator/transformDMMF';

export default class HTMLPrinter implements Generatable<DMMFDocument> {
  data: DMMFDocument;

  constructor(d: DMMFDocument) {
    this.data = this.getData(d);
  }

  getPrismaSvg(): string {
    return `
    <svg
      width="109"
      height="40"
      viewBox="0 0 109 40"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      class="text-black dark:text-white"
      style="cursor: pointer;"
    >
      <g clip-path="url(#clip0)">
      <path
          d="M33.7753 30.4749L19.6557 1.25993C19.4803 0.900386 19.2084 0.593746 18.8687 0.372468C18.529 0.151189 18.1343 0.0235052 17.7262 0.00293118C17.3174 -0.0237544 16.909 0.0592759 16.5452 0.242992C16.1815 0.426708 15.8764 0.704076 15.6632 1.04493L0.349 25.2119C0.116122 25.5768 -0.00515381 25.9989 -0.000609227 26.4286C0.00393536 26.8583 0.134112 27.2778 0.374658 27.6379L7.86191 38.9349C8.14517 39.359 8.56155 39.6825 9.04894 39.8571C9.53633 40.0317 10.0686 40.0482 10.5664 39.9039L32.2943 33.6419C32.6214 33.5487 32.9242 33.3882 33.1822 33.1712C33.4402 32.9541 33.6473 32.6857 33.7897 32.3839C33.93 32.0837 34.0015 31.7574 33.9992 31.4275C33.9969 31.0976 33.9208 30.7722 33.7763 30.4739L33.7753 30.4749ZM30.6141 31.7279L12.1767 37.0399C11.6143 37.2029 11.0744 36.7279 11.1914 36.1749L17.7785 5.44393C17.9017 4.86893 18.7166 4.77793 18.9742 5.30993L31.1684 30.5399C31.2223 30.6524 31.2505 30.7748 31.2511 30.8989C31.2518 31.023 31.2247 31.1458 31.172 31.2587C31.1192 31.3716 31.0419 31.4721 30.9454 31.5531C30.8489 31.6341 30.7355 31.6937 30.6131 31.7279H30.6141Z"
      fill="currentColor"
    ></path>
      </g>
  </svg>

    `;
  }

  getDarkModeToggle(): string {
    return `
    <div class="mt-5">
      <input type="checkbox" id="darkModeToggle">
      <label for="darkModeToggle" class="text-black dark:text-white">Dark Mode</label>
    </div>
    <script>
        const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
        const darkModeToggle = document.getElementById('darkModeToggle');
        function setDarkMode(isDarkMode) {
            if (isDarkMode) {
                document.body.classList.add('dark');
                darkModeToggle.checked = true
            } else {
                document.body.classList.remove('dark');
            }
        }

        setDarkMode(isDarkMode);
        darkModeToggle.addEventListener('change', function () {
            const isDarkMode = this.checked;
            const htmlTag = document.getElementsByTagName("html")[0]
            setDarkMode(isDarkMode);
            localStorage.setItem('isDarkMode', isDarkMode);
        });
    </script>
  `
}

  getHead(csspath: string): string {
    return `
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title>Prisma Generated Docs</title>
    <link rel="stylesheet" href="${csspath}" />
    `;
  }

  getData(d: DMMFDocument) {
    // this can seem redundant but we can have a transform here in the future
    return d;
  }

  toHTML() {
    // all the printers
    const tocGen = new TOCGenerator(this.data);
    const modelGen = new ModelGenerator(this.data);
    const typeGen = new TypesGenerator(this.data);

    return `
<!DOCTYPE html>
<html lang="en">
  <head>
    ${this.getHead('styles/main.css')}
  </head>
  <body class="bg-gray-200 dark:bg-gray-800">
    <div class="flex min-h-screen">
      <div
        class="sticky top-0 w-1/5 flex-shrink-0 h-screen p-4 px-6 overflow-auto bg-white dark:bg-gray-800 mac-h-screen"
      >
        <div class="mb-8">
          ${this.getPrismaSvg()}
          ${this.getDarkModeToggle()}
        </div>
        ${tocGen.toHTML()}
      </div>
      <div class="w-full p-4 bg-white overflow-x-hidden dark:bg-gray-800">
        ${modelGen.toHTML()}
        ${typeGen.toHTML()}
      </div>
      <div>
      </div>
    </div>
  </body>
</html>
`;
  }
}
