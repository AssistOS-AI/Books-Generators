export class BooksGeneratorTemplatesPage {
    constructor(element, invalidate) {
        this.notificationId = "docs";
        this.refreshDocuments = async () => {
            this.documents = await assistOS.space.getDocumentsMetadata(assistOS.space.id);
            //display only documents that are templates
            this.documents = this.documents.filter((document) => {
                return document.title.startsWith("template_")
            }) || [];
            this.documents.forEach((document) => {
                document.title = document.title.split("_")[1];
            });
        };
        this.invalidate = invalidate;
        this.id = "documents";
        this.invalidate(async () => {
            await this.refreshDocuments();
            this.boundsOnListUpdate = this.onListUpdate.bind(this);
        });
    }

    onListUpdate() {
        this.invalidate(this.refreshDocuments);
    }

    async beforeRender() {
        this.tableRows = "";
        this.documents.forEach((document) => {
            this.tableRows += `<document-item data-name="${document.title}" 
            data-id="${document.id}" data-local-action="editAction"></document-item>`;
        });
        if (assistOS.space.loadingDocuments) {
            assistOS.space.loadingDocuments.forEach((taskId) => {
                this.tableRows += `<div data-id="${taskId}" class="placeholder-document">
                <div class="loading-icon small"></div>
            </div>`;
            });
        }
        if (this.tableRows === "") {
            this.tableRows = `<div> There are no Book Templates yet </div>`;
        }
    }

    async afterRender() {

    }

    async editAction(_target) {
        let documentId = this.getDocumentId(_target);
        await assistOS.UI.changeToDynamicPage("space-application-page", `${assistOS.space.id}/Space/document-view-page/${documentId}`);
    }

    getDocumentId(_target) {
        return assistOS.UI.reverseQuerySelector(_target, "document-item").getAttribute("data-id");
    }

    async showActionBox(_target, primaryKey, componentName, insertionMode) {
        await assistOS.UI.showActionBox(_target, primaryKey, componentName, insertionMode);
    }

    async openGenerateBookTemplateModal(_target) {
        const taskId = await assistOS.UI.showModal("book-generator-template-modal", {
            "presenter": "book-generator-template-modal",
        }, true);
        if (taskId) {
            assistOS.watchTask(taskId);
        }
    }

    async generateBook(_target) {
        await assistOS.UI.showModal("books-generator-modal", {
            "presenter": "books-generator-modal",
            "documentId": this.getDocumentId(_target)
        });
    }
}
