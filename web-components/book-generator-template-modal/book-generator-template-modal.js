const applicationModule = require('assistos').loadModule('application', {});
const personalityModule = require('assistos').loadModule('personality', {});

export class BooksGeneratorTemplateModal {
    constructor(element, invalidate) {
        this.element = element;
        this.invalidate = invalidate;
        this.invalidate();
    }

    async beforeRender() {
        const personalities = await personalityModule.getPersonalitiesMetadata(assistOS.space.id);
        this.personalityOptions= personalities.map(personality => {
            return `<option value="${personality.id}">${personality.name}</option>`;
        })
        this.templateData = JSON.parse(JSON.parse(await applicationModule.getApplicationFile(assistOS.space.id, "BooksGenerator", "data/templateData.json")));
        this.genres = this.templateData.genres.map(genre => {
            return `<option value="${genre}">${genre}</option>`;
        });
        this.tones= this.templateData.tones.map(tone => {
            return `<option value="${tone}">${tone}</option>`;
        })
        this.subjects= this.templateData.subjects.map(subject => {
            return `<option value="${subject}">${subject}</option>`;
        })
        this.writingStyles= this.templateData.writingStyles.map(writingStyle => {
            return `<option value="${writingStyle}">${writingStyle}</option>`;
        });
        this.languages= this.templateData.languages.map(language => {
            return `<option value="${language}">${language}</option>`;
        });
        this.targetAudiences= this.templateData.targetAudiences.map(targetAudience => {
            return `<option value="${targetAudience}">${targetAudience}</option>`;
        });
        this.timePeriods= this.templateData.timePeriods.map(timePeriod => {
            return `<option value="${timePeriod}">${timePeriod}</option>`;
        });
        this.environments= this.templateData.environments.map(environmentType => {
            return `<option value="${environmentType}">${environmentType}</option>`;
        });

        this.themes= this.templateData.themes.map(theme => {
            return `<option value="${theme}">${theme}</option>`;
        });
    }

    async afterRender() {
    }

    async closeModal(_target) {
        await assistOS.UI.closeModal(_target);
    }

    async generateBookTemplate(_target) {
        await assistOS.loadifyFunction(async () => {
                const formElement = this.element.querySelector("form");
                const formData = await assistOS.UI.extractFormInformation(formElement);
                if (!formData.isValid) {
                    return assistOS.UI.showApplicationError("Invalid form data", "Please fill all the required fields", "error");
                }
                const documentData = formData.data;
                const documentId = (await applicationModule.runApplicationFlow(assistOS.space.id, "BooksGenerator", "GenerateTemplate", documentData)).data;
                assistOS.UI.closeModal(_target);
                await assistOS.UI.changeToDynamicPage(`space-application-page`, `${assistOS.space.id}/Space/document-view-page/${documentId}`);
            }
        )
    }
    async PreviewBookTemplateModal(_target) {
        await assistOS.UI.showModal("book-generator-template-preview", {
            "presenter": "book-generator-template-preview",
        });
    }
}
