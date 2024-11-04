/*const applicationModule = require('assistos').loadModule('application', {});

export class BooksGeneratorModal {
    constructor(element, invalidate) {
        this.element = element;
        this.invalidate = invalidate;
        this.documentId = this.element.getAttribute("data-documentId")
        this.invalidate();

    }

    async beforeRender() {
    }

    async afterRender() {
    }

    async closeModal(_target) {
        await assistOS.UI.closeModal(_target);
    }

    async generateBook(_target) {
        await assistOS.loadifyFunction(async () => {
                const formElement = this.element.querySelector("form");
                const formData = await assistOS.UI.extractFormInformation(formElement);
                if (!formData.isValid) {
                    return assistOS.UI.showApplicationError("Invalid form data", "Please fill all the required fields", "error");
                }
                const {llm, size} = formData.data;
                const bookGenerationData = {
                    llm,
                    size,
                    documentId: this.documentId
                }
                const documentId = (await applicationModule.runApplicationFlow(assistOS.space.id, "BooksGenerator", "GenerateBook", bookGenerationData)).data;
                assistOS.UI.closeModal(_target);
                await assistOS.UI.changeToDynamicPage(`space-application-page`, `${assistOS.space.id}/Space/document-view-page/${documentId}`);
            }
        )
    }

}
*/

const applicationModule = require('assistos').loadModule('application', {});
const utilModule = require('assistos').loadModule('util', {}); // Importă utilModule

export class BooksGeneratorModal {
    constructor(element, invalidate) {
        this.element = element;
        this.invalidate = invalidate;
        this.documentId = this.element.getAttribute("data-documentId");
        this.invalidate();
    }

    async beforeRender() {
        this.generateBookSchema = JSON.parse(JSON.parse(await applicationModule.getApplicationFile(assistOS.space.id, "BooksGenerator", "templates/Prompts/generateBooksSchema.json")));
    }

    async afterRender() {
        await this.updateReviewPrompt();
        this.addEventListeners();
    }

    addEventListeners() {
        const inputs = this.element.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => this.updateReviewPrompt());
        });
    }

    async updateReviewPrompt() {
        const formElement = this.element.querySelector("form");
        const formData = await assistOS.UI.extractFormInformation(formElement);

        const bookData = {
            llm: formData.data.llm || 'ChatGPT',
            size: formData.data.size || '',
            author: formData.data.author || '',
            edition: formData.data.edition || ''
        };


        const updatedTemplateData = {
            bookData
        };

        let filledJSONTemplate = utilModule.fillTemplate(this.generateBookSchema, updatedTemplateData);

        this.renderPrompt(filledJSONTemplate);
        this.element.querySelector("#review-prompt").value = this.reviewPrompt;
    }

   renderPrompt(schemaData) {
       this.reviewPrompt = Object.keys(schemaData)
            .map(key => {
                if (!isNaN(parseInt(key))) {
                    return schemaData[key]
                }
            })
            .join(".\n");
    }




    async closeModal(_target) {
        await assistOS.UI.closeModal(_target);
    }

    async generateBook(_target) {
        await assistOS.loadifyFunction(async () => {
            const formElement = this.element.querySelector("form");
            const formData = await assistOS.UI.extractFormInformation(formElement);

            if (!formData.isValid) {
                return assistOS.UI.showApplicationError("Invalid form data", "Please fill all the required fields", "error");
            }

            const { llm, size } = formData.data;
            const bookGenerationData = {
                llm,
                size,
                documentId: this.documentId
            };

            const documentId = (await applicationModule.runApplicationFlow(assistOS.space.id, "BooksGenerator", "GenerateBook", bookGenerationData)).data;
            assistOS.UI.closeModal(_target);
                assistOS.UI.closeModal(_target);
                await assistOS.UI.changeToDynamicPage(`space-application-page`, `${assistOS.space.id}/Space/document-view-page/${documentId}`);
            }
        )
    }

}