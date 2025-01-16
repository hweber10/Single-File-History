import type { ValidationAcceptor, ValidationChecks } from 'langium';
import { SingleFileHistoryAstType, History, Project, Model } from './generated/ast.js';
import type { SingleFileHistoryServices } from './single-file-history-module.js';
const validateDate = require("validate-date");
/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: SingleFileHistoryServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.SingleFileHistoryValidator;
    const checks: ValidationChecks<SingleFileHistoryAstType> = {
        History: validator.checkForCorrectHistoryDefinition,
        Project: validator.checkForCorrectProjectDefinition,
        Model: validator.checkForCorrectModelDefinition
    };
    registry.register(checks, validator);
}

const correctTypes = ["Task", "Information"];
const correctStates = ["Open", "Closed"];

/**
 * Implementation of custom validations.
 */
export class SingleFileHistoryValidator {

    checkForCorrectModelDefinition(model: Model, accept: ValidationAcceptor): void {
        if(!this.correctVersion(model.version)){
            accept('warning', 'please write the Version in the following Format: x.y or x.y.z', { node: model, property: 'version'});
        }
        this.checkForUniqueIDs(model, accept);
    }

    checkForCorrectProjectDefinition(project: Project, accept: ValidationAcceptor): void {
        if(!this.correctCBD(project.cbdnumber)){
            accept('warning', 'The CBD must start with `CBD` followed by a Number.', { node: project, property: 'cbdnumber'});
        }
        if(!this.correctPRJ(project.prjnumber)){
            accept('warning', 'The PRJ must start with `PRJ` followed by a Number.', { node: project, property: 'prjnumber'});
        }
        if(!this.correctVersion(project.sdpversion)){
            accept('warning', 'please write the Version in the following Format: x.y or x.y.z', { node: project, property: 'sdpversion'});
        }
    }

    checkForCorrectHistoryDefinition(history: History, accept: ValidationAcceptor): void {
        if(!this.correctDateFormat(history.date)){
            accept('warning', 'please write your Date in the following Format: YYYY-MM-DD', { node: history, property: 'date'});
        }else if(!this.correctDate(history.date)){
            accept('warning', 'please enter a existing Date.', { node: history, property: 'date'});
        }
        if(!this.correctDateFormat(history.duedate)){
            accept('warning', 'please write your DueDate in the following Format: YYYY-MM-DD', { node: history, property: 'duedate'});
        }else if(!this.correctDate(history.duedate)){
            accept('warning', 'please enter a existing Date.', { node: history, property: 'duedate'});
        }
        if(!this.correctID(history.id)){
            accept('warning', "The ID must start with `H` followed by a Number.", { node: history, property: 'id'});
        }
        if(!this.correctDel(history.del)){
            accept('warning', "The DEL must start with one or more uppercase Letters followed by a Number.", { node: history, property: 'del'});
        }
        if(!this.correctType(history.type)){
            accept('warning', "The Type must be one of the following Items:\n"+correctTypes, { node: history, property: 'type'});
        }
        if(!this.correctState(history.state)){
            accept('warning', "The State must be one of the following Items:\n"+correctStates, { node: history, property: 'state'});
        }
    }
    
    checkForUniqueIDs(model: Model, accept: ValidationAcceptor): void {
        // create a set of visited functions
        // and report an error when we see one we've already seen
        const reported = new Set();
        model.history.forEach(d => {
            if (reported.has(d.id)) {
                accept('error',  `The ID '${d.id}' is not unique.`,  {node: d, property: 'id'});
            }
            reported.add(d.id);
        });
    }

    correctDate(date: string): boolean {
        return validateDate(date, "boolean", "yyyy-mm-dd");
    }

    correctType(type: string): boolean {
        return correctTypes.includes(type);
    }

    correctState(state: string): boolean {
        return correctStates.includes(state);
    }

    correctID(id: string): boolean {
        let regex = new RegExp("^H\\d+$");
        return regex.test(id);
    }

    correctDel(del: string): boolean {
        let regex = new RegExp("^[A-Z]+\\d+");
        return regex.test(del);
    }

    correctDateFormat(date: string): boolean {
        let regex = new RegExp("^\\d{4}\\-\\d{2}\\-\\d{2}$");
        return regex.test(date);
    }

    correctCBD(cbd: string): boolean {
        let regex = new RegExp("^CBD\\d+$");
        return regex.test(cbd);
    }

    correctPRJ(cbd: string): boolean {
        let regex = new RegExp("^PRJ\\d+$");
        return regex.test(cbd);
    }

    correctVersion(version: string): boolean {
        let regex = new RegExp("^\\d+(\\.\\d+){1,2}$");
        return regex.test(version);
    }

}
