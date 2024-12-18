const applicationModule = require('assistos').loadModule('application', {});
const utilModule = require('assistos').loadModule('util', {});
const personalityModule = require('assistos').loadModule('personality', {});


export class BooksGeneratorModal {
    constructor(element, invalidate) {
        this.element = element;
        this.invalidate = invalidate;
        this.documentId = this.element.getAttribute("data-documentId");
        this.invalidate();
    }

    async beforeRender() {
        const personalities = await personalityModule.getPersonalitiesMetadata(assistOS.space.id);
        this.personalities = personalities;
        this.personalityOptions = personalities.map(personality => {
            return `<option value="${personality.id}">${personality.name}</option>`;
        });

        this.generateBookSchema = JSON.parse(JSON.parse(await applicationModule.getApplicationFile(assistOS.space.id, "BooksGenerator", "templates/Prompts/generateBooksSchema.json")));
        this.generateBookSchema1 = JSON.parse(JSON.parse(await applicationModule.getApplicationFile(assistOS.space.id, "BooksGenerator", "templates/Prompts/generateBooksSchemaAnother.json")));
        this.prompts =
            `<option value="generateBookSchema">Book Schema</option>` +
            `<option value="generateBookSchema1">Basic Template</option>` ;
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
        const promptSelector = this.element.querySelector("#promptTemplate");
        if (promptSelector) {
            promptSelector.addEventListener('change', () => this.updateReviewPrompt());
        }
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


        const templates = {
            generateBookSchema:  this.generateBookSchema,
            generateBookSchema1:  this.generateBookSchema1

        };

        const selectedPrompt = this.element.querySelector("#promptTemplate").value;
        const selectedTemplate = templates[selectedPrompt];

        if (selectedTemplate) {
            const filledJSONTemplate = utilModule.fillTemplate(selectedTemplate, updatedTemplateData);
            const reviewPrompt = this.renderPrompt(filledJSONTemplate);
            this.element.querySelector("#review-prompt").value = reviewPrompt;
        }
    }

   renderPrompt(schemaData) {
       return Object.keys(schemaData)
           .map(key => {
               if (!isNaN(parseInt(key))) {
                   return schemaData[key];
               }
           })
           .join("\n");
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
            const taskId = await applicationModule.runApplicationTask(assistOS.space.id, "BooksGenerator", "GenerateBook", bookGenerationData);
            assistOS.UI.closeModal(_target,taskId);
            }
        )
    }

}
