const applicationModule = require('assistos').loadModule('application', {});

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
