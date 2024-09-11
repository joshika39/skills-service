/*
 * Copyright 2020 SkillTree
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// const attachFiles = require('cypress-form-data-with-file-upload');
describe('Icon Manager Tests', () => {

    beforeEach(() => {
        cy.request('POST', '/app/projects/proj1', {
            projectId: 'proj1',
            name: "proj1"
        })

        cy.intercept({
            method: 'POST',
            url: '/admin/projects/proj1/subjects/subj1'
        }).as('saveSubject');

        cy.intercept('POST', `/admin/projects/proj1/badges/badge1`)
            .as('saveBadge');

        cy.intercept({
            method: 'POST',
            url: '/admin/projects/proj1/icons/upload',
        }).as('uploadIcon');
    });

    it('subject - select font awesome icon', () => {
        cy.request('POST', '/admin/projects/proj1/subjects/subj1', {
            projectId: 'proj1',
            subjectId: 'subj1',
            name: "Subject 1"
        });

        cy.visit('/administrator/projects/proj1/');
        cy.get('[data-cy="subjectCard-subj1"] [data-cy="editBtn"]').click();

        cy.get('[data-cy="iconPicker"]').click();
        cy.get('.p-menuitem-link').contains('Font Awesome Free').click();
        cy.wait(1500);
        // cy.get('[role=tabpanel][aria-hidden=false]').should('be.visible');
        cy.get('[data-cy=virtualIconList]').scrollTo(0,540);
        cy.get('.icon-item>a:visible', {timeout:10000}).should('be.visible').last().then(($el)=> {
            const clazz = $el.attr('data-cy');
            cy.get(`[data-cy="${clazz}"]`).should('have.length', '1').click({force:true});
            cy.get('[data-cy=saveDialogBtn]').scrollIntoView().should('be.visible').click();
            cy.get('.preview-card-title').contains('Subject 1').should('be.visible');
            const classes = clazz.split(' ');
            let iconClass = classes[classes.length-1];
            iconClass = iconClass.replace(/-link$/, '')
            cy.get(`i.${iconClass}`).should('be.visible');
        })
    });

    it('subject - select material icon', () => {
        cy.request('POST', '/admin/projects/proj1/subjects/subj1', {
            projectId: 'proj1',
            subjectId: 'subj1',
            name: "Subject 1"
        });

        cy.visit('/administrator/projects/proj1/');
        cy.get('[data-cy="subjectCard-subj1"] [data-cy="editBtn"]').click();
        cy.get('[data-cy="iconPicker"]').click();
        cy.get('.p-menuitem-link').contains('Material').click();
        cy.wait(2500);
        // cy.get('[role=tabpanel][aria-hidden=false]').should('be.visible');
        cy.get('[data-cy=virtualIconList]').scrollTo(0,540);
        cy.get('.icon-item>a:visible',{timeout:1000}).last().then(($el)=> {
            const clazz = $el.attr('data-cy');
            cy.get(`[data-cy="${clazz}"]`).should('have.length', '1').click({ force: true });
            cy.get('[data-cy=saveDialogBtn]').scrollIntoView().should('be.visible').click();
            cy.get('.preview-card-title').contains('Subject 1').should('be.visible');
            const classes = clazz.split(' ');
            let iconClass = classes[classes.length - 1];
            iconClass = iconClass.replace(/-link$/, '')
            cy.get(`i.${iconClass}`).should('be.visible');
        });
    });

    it('badge - select font awesome icon', () => {
        cy.request('POST', '/admin/projects/proj1/badges/badge1', {
            projectId: 'proj1',
            badgeId: 'badge1',
            name: 'Badge 1'
        });

        cy.visit('/administrator/projects/proj1/badges');
        cy.get('[data-cy="badgeCard-badge1"] [data-cy="editBtn"]').click();

        cy.get('[data-cy="iconPicker"]').click();
        cy.get('.p-menuitem-link').contains('Font Awesome Free').click();
        cy.wait(1500);
        // cy.get('[role=tabpanel][aria-hidden=false]').should('be.visible');
        cy.get('[data-cy=virtualIconList]').scrollTo(0,540);
        cy.get('.icon-item>a:visible', {timeout:10000}).should('be.visible').last().then(($el)=> {
            const clazz = $el.attr('data-cy');
            cy.get(`[data-cy="${clazz}"]`).should('have.length', '1').click({force:true});
            cy.get('[data-cy=saveDialogBtn]').scrollIntoView().should('be.visible').click();
            cy.get('.preview-card-title').contains('Badge 1').should('be.visible');
            const classes = clazz.split(' ');
            let iconClass = classes[classes.length-1];
            iconClass = iconClass.replace(/-link$/, '')
            cy.get(`i.${iconClass}`).should('be.visible');
        })
    });

    it('badge - select material icon', () => {
        cy.request('POST', '/admin/projects/proj1/badges/badge1', {
            projectId: 'proj1',
            badgeId: 'badge1',
            name: 'Badge 1'
        });

        cy.visit('/administrator/projects/proj1/badges');
        cy.get('[data-cy="badgeCard-badge1"] [data-cy="editBtn"]').click();
        cy.get('[data-cy="iconPicker"]').click();
        cy.get('.p-menuitem-link').contains('Material').click();
        cy.wait(2500);
        // cy.get('[role=tabpanel][aria-hidden=false]').should('be.visible');
        cy.get('[data-cy=virtualIconList]').scrollTo(0,540);
        cy.get('.icon-item>a:visible',{timeout:1000}).last().then(($el)=> {
            const clazz = $el.attr('data-cy');
            cy.get(`[data-cy="${clazz}"]`).should('have.length', '1').click({ force: true });
            cy.get('[data-cy=saveDialogBtn]').scrollIntoView().should('be.visible').click();
            cy.get('.preview-card-title').contains('Badge 1').should('be.visible');
            const classes = clazz.split(' ');
            let iconClass = classes[classes.length - 1];
            iconClass = iconClass.replace(/-link$/, '')
            cy.get(`i.${iconClass}`).should('be.visible');
        });
    });

    it('search icons', () => {
        cy.request('POST', '/admin/projects/proj1/subjects/subj1', {
            projectId: 'proj1',
            subjectId: 'subj1',
            name: "Subject 1"
        });

        cy.visit('/administrator/projects/proj1/');
        cy.get('[data-cy="subjectCard-subj1"] [data-cy="editBtn"]').click();
        cy.get('[data-cy="iconPicker"]').click();
        cy.get('[data-cy=icon-search]').type('run');
        cy.get('.fas.fa-running').should('be.visible');
        //filter should persist between tab changes
        cy.get('.p-menuitem-link').contains('Material').click();
        cy.get('.mi.mi-directions-run').should('be.visible');

        cy.get('.p-menuitem-link').contains('Font Awesome Free').click();
        cy.get('.fas.fa-running').should('be.visible');

        //filter should not persist when icon manager is re-opened
        cy.get('.p-overlaypanel-close-icon').click();
        cy.get('[data-cy="iconPicker"]').click();
        cy.get('[data-cy=icon-search]').should('have.value', '');
        cy.get('i.fas.fa-ad').should('be.visible');
        cy.get('.p-menuitem-link').contains('Material').click();
        cy.get('i.mi.mi-3d-rotation').should('be.visible');
    });

    it('upload custom icon', () => {
        cy.request('POST', '/admin/projects/proj1/subjects/subj1', {
            projectId: 'proj1',
            subjectId: 'subj1',
            name: "Subject 1"
        });


        // TODO - waiting on https://github.com/cypress-io/cypress/issues/1647
        // cy.intercept('/admin/projects/proj1/icons/upload').as('uploadIcon');

        cy.visit('/administrator/projects/proj1/');

        cy.get('[data-cy="subjectCard-subj1"] [data-cy="editBtn"]').click();

        cy.get('[data-cy="iconPicker"]').click();

        cy.get('.p-menuitem-link').contains('Custom').click();

        const filename = 'valid_icon.png';
        cy.get('[data-cy="fileInput"]').attachFile(filename);
        cy.wait('@uploadIcon')

        cy.get('.proj1-validiconpng');
    });


    it('upload custom icon - invalid mime type client validation', () => {
        cy.intercept('/app/projects/proj1/customIcons').as('getCustomIcons')
        cy.intercept('/api/projects/proj1/customIconCss').as('getCustomIconsCss')

        cy.request('POST', '/admin/projects/proj1/subjects/subj1', {
            projectId: 'proj1',
            subjectId: 'subj1',
            name: "Subject 1"
        });

        cy.visit('/administrator/projects/proj1/');
        // cy.wait('@getCustomIconsCss')

        cy.get('[data-cy="subjectCard-subj1"] [data-cy="editBtn"]').click();

        cy.get('[data-cy="iconPicker"]').click();
        // cy.wait('@getCustomIcons')

        cy.get('.p-menuitem-link').contains('Custom').click();
        // cy.get('[data-cy="customIconUpload"]').contains('Drag your file here to upload')
        cy.wait(2000)

        const filename = 'invalid_file.txt';
        cy.get('[data-cy="fileInput"]').attachFile(filename);

        cy.get('[data-cy="iconErrorMessage"]').contains('File is not an image format');
    });

    it('upload custom icon - server side error', () => {
        cy.request('POST', '/admin/projects/proj1/subjects/subj1', {
            projectId: 'proj1',
            subjectId: 'subj1',
            name: "Subject 1"
        });

        cy.intercept('POST', '/admin/projects/proj1/icons/upload', {
            statusCode: 400,
            response: {explanation: 'Something bad'}
        }).as('addAdmin');

        cy.visit('/administrator/projects/proj1/');

        cy.get('[data-cy="subjectCard-subj1"] [data-cy="editBtn"]').click();

        cy.get('[data-cy="iconPicker"]').click();

        cy.get('.p-menuitem-link').contains('Custom').click();

        const filename = 'valid_icon.png';
        cy.get('[data-cy="fileInput"]').attachFile(filename);

        cy.get('[data-cy="iconErrorMessage"]').contains('Encountered error when uploading');
    });

    it('subject - upload custom icon - persists on navigating away', () => {
        cy.request('POST', '/admin/projects/proj1/subjects/subj1', {
            projectId: 'proj1',
            subjectId: 'subj1',
            name: "Subject 1"
        });


        // TODO - waiting on https://github.com/cypress-io/cypress/issues/1647
        // cy.intercept('/admin/projects/proj1/icons/upload').as('uploadIcon');

        cy.visit('/administrator/projects/proj1/');

        cy.get('[data-cy="subjectCard-subj1"] [data-cy="editBtn"]').click();

        cy.get('[data-cy="iconPicker"]').click();

        cy.get('.p-menuitem-link').contains('Custom').click();

        const filename = 'valid_icon.png';
        cy.get('[data-cy="fileInput"]').attachFile(filename);
        cy.wait('@uploadIcon')

        cy.get('[data-cy=saveDialogBtn]').click();
        cy.clickNav('Badges');
        cy.clickNav('Subjects');

        cy.get('.proj1-validiconpng');
    });

    it('subject - upload custom icon - persists on refresh', () => {
        cy.request('POST', '/admin/projects/proj1/subjects/subj1', {
            projectId: 'proj1',
            subjectId: 'subj1',
            name: "Subject 1"
        });

        cy.visit('/administrator/projects/proj1/');

        cy.get('[data-cy="subjectCard-subj1"] [data-cy="editBtn"]').click();

        cy.get('[data-cy="iconPicker"]').click();

        cy.get('.p-menuitem-link').contains('Custom').click();

        const filename = 'valid_icon.png';
        cy.get('[data-cy="fileInput"]').attachFile(filename);
        cy.wait('@uploadIcon')

        cy.get('[data-cy=saveDialogBtn]').click();

        cy.wait('@saveSubject');
        cy.reload();

        cy.get('.proj1-validiconpng');
    });

    it('subject - upload custom icon - persists when navigating from another project', () => {
        cy.request('POST', '/app/projects/proj2', {
            projectId: 'proj2',
            name: "proj2"
        })

        cy.request('POST', '/admin/projects/proj1/subjects/subj1', {
            projectId: 'proj1',
            subjectId: 'subj1',
            name: "Subject 1"
        });

        cy.visit('/administrator/projects/proj1/');

        cy.get('[data-cy="subjectCard-subj1"] [data-cy="editBtn"]').click();

        cy.get('[data-cy="iconPicker"]').click();

        cy.get('.p-menuitem-link').contains('Custom').click();

        const filename = 'valid_icon.png';
        cy.get('[data-cy="fileInput"]').attachFile(filename);
        cy.wait('@uploadIcon')

        cy.get('[data-cy=saveDialogBtn]').click();

        cy.wait('@saveSubject');
        cy.reload();

        cy.visit('/administrator/projects/proj2/');

        cy.get('[data-cy=breadcrumb-Projects]').click();
        cy.get('[data-cy=projCard_proj1_manageLink]').click();

        cy.get('.proj1-validiconpng');
    });

    it('subject - upload custom icon - persists when navigating from outside of admin', () => {
        cy.request('POST', '/app/projects/proj2', {
            projectId: 'proj2',
            name: "proj2"
        })

        cy.request('POST', '/admin/projects/proj1/subjects/subj1', {
            projectId: 'proj1',
            subjectId: 'subj1',
            name: "Subject 1"
        });

        cy.visit('/administrator/projects/proj1/');

        cy.get('[data-cy="subjectCard-subj1"] [data-cy="editBtn"]').click();

        cy.get('[data-cy="iconPicker"]').click();

        cy.get('.p-menuitem-link').contains('Custom').click();

        const filename = 'valid_icon.png';
        cy.get('[data-cy="fileInput"]').attachFile(filename);
        cy.wait('@uploadIcon')

        cy.get('[data-cy=saveDialogBtn]').click();

        cy.wait('@saveSubject');
        cy.reload();

        cy.visit('/progress-and-rankings/');

        cy.get('[data-cy=settings-button]')
            .click();
        cy.contains('Project Admin')
            .click();

        cy.get('[data-cy=projCard_proj1_manageLink]').click();

        cy.get('.proj1-validiconpng');
    });

    it('badge - upload custom icon - persists on navigating away', () => {
        cy.request('POST', '/admin/projects/proj1/badges/badge1', {
            projectId: 'proj1',
            badgeId: 'badge1',
            name: 'Badge 1'
        });

        cy.visit('/administrator/projects/proj1/badges');

        cy.get('[data-cy="badgeCard-badge1"] [data-cy="editBtn"]').click();

        cy.get('[data-cy="iconPicker"]').click();

        cy.get('.p-menuitem-link').contains('Custom').click();

        const filename = 'valid_icon.png';
        cy.get('[data-cy="fileInput"]').attachFile(filename);
        cy.wait('@uploadIcon')

        cy.get('[data-cy=saveDialogBtn]').click();
        cy.wait('@saveBadge')
        cy.get('[data-cy="badgeCard-badge1"] .proj1-validiconpng');

        cy.clickNav('Metrics');
        cy.clickNav('Badges');

        cy.get('[data-cy="badgeCard-badge1"] .proj1-validiconpng');
    });

    it('badge - upload custom icon - persists on refresh', () => {
        cy.request('POST', '/admin/projects/proj1/badges/badge1', {
            projectId: 'proj1',
            badgeId: 'badge1',
            name: 'Badge 1'
        });

        cy.visit('/administrator/projects/proj1/badges');

        cy.get('[data-cy="badgeCard-badge1"] [data-cy="editBtn"]').click();

        cy.get('[data-cy="iconPicker"]').click();

        cy.get('.p-menuitem-link').contains('Custom').click();

        const filename = 'valid_icon.png';
        cy.get('[data-cy="fileInput"]').attachFile(filename);
        cy.wait('@uploadIcon')

        cy.get('[data-cy=saveDialogBtn]').click();

        cy.wait('@saveBadge')
        cy.reload();

        cy.get('.proj1-validiconpng');
    });

    it('badge - upload custom icon - persists when navigating from another project', () => {
        cy.request('POST', '/app/projects/proj2', {
            projectId: 'proj2',
            name: "proj2"
        })

        cy.request('POST', '/admin/projects/proj1/badges/badge1', {
            projectId: 'proj1',
            badgeId: 'badge1',
            name: 'Badge 1'
        });

        cy.visit('/administrator/projects/proj1/badges');

        cy.get('[data-cy="badgeCard-badge1"] [data-cy="editBtn"]').click();

        cy.get('[data-cy="iconPicker"]').click();

        cy.get('.p-menuitem-link').contains('Custom').click();

        const filename = 'valid_icon.png';
        cy.get('[data-cy="fileInput"]').attachFile(filename);
        cy.wait('@uploadIcon')

        cy.get('[data-cy=saveDialogBtn]').click();

        cy.wait('@saveBadge')
        cy.reload();

        cy.visit('/administrator/projects/proj2/');

        cy.get('[data-cy=breadcrumb-Projects]').click();
        cy.get('[data-cy=projCard_proj1_manageLink]').click();

        cy.clickNav('Badges');

        cy.get('.proj1-validiconpng');
    });

    it('badge - upload custom icon - persists when navigating from outside of admin', () => {
        cy.request('POST', '/app/projects/proj2', {
            projectId: 'proj2',
            name: "proj2"
        })

        cy.request('POST', '/admin/projects/proj1/badges/badge1', {
            projectId: 'proj1',
            badgeId: 'badge1',
            name: 'Badge 1'
        });

        cy.visit('/administrator/projects/proj1/badges');

        cy.get('[data-cy="badgeCard-badge1"] [data-cy="editBtn"]').click();

        cy.get('[data-cy="iconPicker"]').click();

        cy.get('.p-menuitem-link').contains('Custom').click();

        const filename = 'valid_icon.png';
        cy.get('[data-cy="fileInput"]').attachFile(filename);
        cy.wait('@uploadIcon')

        cy.get('[data-cy=saveDialogBtn]').click();

        cy.wait('@saveBadge')
        cy.reload();

        cy.visit('/progress-and-rankings/');

        cy.get('[data-cy=settings-button]')
            .click();
        cy.contains('Project Admin')
            .click();

        cy.get('[data-cy=projCard_proj1_manageLink]').click();
        cy.clickNav('Badges');

        cy.get('.proj1-validiconpng');
    });

    it('upload custom icon - error displays after being closed', () => {
        cy.intercept('/app/projects/proj1/customIcons').as('getCustomIcons')
        cy.intercept('/api/projects/proj1/customIconCss').as('getCustomIconsCss')

        cy.request('POST', '/admin/projects/proj1/subjects/subj1', {
            projectId: 'proj1',
            subjectId: 'subj1',
            name: "Subject 1"
        });

        cy.visit('/administrator/projects/proj1/');
        // cy.wait('@getCustomIconsCss')

        cy.get('[data-cy="subjectCard-subj1"] [data-cy="editBtn"]').click();

        cy.get('[data-cy="iconPicker"]').click();
        // cy.wait('@getCustomIcons')

        cy.get('.p-menuitem-link').contains('Custom').click();
        // cy.get('[data-cy="customIconUpload"]').contains('Drag your file here to upload')
        cy.wait(2000)

        const filename = 'invalid_file.txt';
        cy.get('[data-cy="fileInput"]').attachFile(filename);

        cy.get('[data-cy="iconErrorMessage"]').contains('File is not an image format');

        cy.get('.p-message-close').click();
        cy.get('[data-cy="iconErrorMessage"]').should('not.exist');

        cy.get('[data-cy="fileInput"]').attachFile(filename);

        cy.get('[data-cy="iconErrorMessage"]').contains('File is not an image format');
    });
});
