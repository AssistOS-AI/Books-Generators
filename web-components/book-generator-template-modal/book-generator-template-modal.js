const applicationModule=require('assistos').loadModule('application',{});

export class BooksGeneratorTemplateModal {
    constructor(element, invalidate) {
        this.element = element;
        this.invalidate = invalidate;
        this.invalidate();
    }

    async beforeRender() {
    }

    async afterRender() {
    }

    async closeModal(_target) {
        await assistOS.UI.closeModal(_target);
    }

    async generateBookTemplate(_target) {
        const formElement = this.element.querySelector("form");
        const formData = await assistOS.UI.extractFormInformation(formElement);
        if (!formData.isValid) {
            return assistOS.UI.showApplicationError("Invalid form data", "Please fill all the required fields", "error");
        }
        const documentData = formData.data;
        debugger
        const flowTaskId = await applicationModule.runApplicationFlow(assistOS.space.id, "BooksGenerator", "GenerateTemplate", documentData);
        assistOS.UI.closeModal(_target);
        await assistOS.UI.changeToDynamicPage(`space-application-page`, `${assistOS.space.id}/Space/document-view-page/${docId}`);
    }

}
