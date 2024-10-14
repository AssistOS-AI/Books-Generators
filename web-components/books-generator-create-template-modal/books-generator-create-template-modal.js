const bookModule = require('assistos').loadModule('books', {});

export class BooksGeneratorCreateTemplateModal {
    constructor(element, invalidate) {
        this.element = element;
        this.invalidate = invalidate;
        this.invalidate();
    }

    async beforeRender() {
        const buildLanguageOptionsHTML = (languages = []) => {
            const defaultLanguages = ["english", "romanian"];
            let options = '';
            languages = [...new Set([...languages, ...defaultLanguages])];
            languages.forEach(language => {
                options += `<option value="${language}">${language}</option>`;
            });
            return options;
        }
        const buildGenreOptionsHTML = (genres = []) => {
            const defaultGenres = ["action", "adventure", "comedy", "drama", "fantasy", "horror", "mystery", "romance", "sci-fi", "thriller"];
            genres = [...new Set([...genres, ...defaultGenres])];
            let options = '';
            genres.forEach(genre => {
                options += `<option value="${genre}">${genre}</option>`;
            });
            return options;
        }

        this.languageOptions = buildLanguageOptionsHTML();
        this.genresOptions = buildGenreOptionsHTML();
        this.user = assistOS.user.email.split('@')[0] || assistOS.space.name;
    }

    async afterRender() {

    }

    async closeModal(_target, data) {
        await assistOS.UI.closeModal(_target);
    }

    async generateTemplate(_target) {
        const formData = await assistOS.UI.extractFormInformation(_target);
        if (!formData.isValid) {
            showApplicationError('Invalid form data', 'Invalid form data', 'Invalid form data');
        }
        return await this.closeModal(_target, formData.data || {});
    }
}
