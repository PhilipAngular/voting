module.exports = {

  prompter: function (_cz, _commit) {

    // Variables
    let issuesTexts = '';
    let answers1;

    // Lists
    const typeChoices = [
      { value: 'docs', name: '1- docs: Documentations' },
      { value: 'feat', name: '2- feat: New feature' },
      { value: 'fix', name: '3- fix: A bug fix' },
      { value: 'perf', name: '4- perf: Performances' },
      { value: 'refac', name: '5- refac: Refactories to improve the code' },
      { value: 'style', name: '6- style: Screen style' }
    ];

    const appPartChoices = [
      { value: 'back', name: '1- Backend is the server' },
      { value: 'front', name: '2- Frontend is the client' },
      { value: 'db', name: '3- Database is the records store' },
      { value: 'general', name: '4- General is configurations to one ore more app parts' }
    ];

    const issueActionChoices = [
      { value: 'resolve', name: '1- Resolve an issue' },
      { value: 'reopen', name: '2- reopen an issue' },
      { value: 'wontfix', name: '3- mark an issue wontfix' },
      { value: 'invalidate', name: '4- mark an issue invalid' },
      { value: 'references', name: '5- link to a changeset for the issue' }
    ];

    // Prompt questions and contents
    const typePrompt = {
      choices: typeChoices,
      message: `Select the type of change that you're commiting:`,
      name: 'type',
      type: 'list'
    };

    const scopePrompt = {
      choices: appPartChoices,
      message: 'Denote the app part changed in this commit (backend, frontend, database):\n',
      name: 'scope',
      type: 'list'
    };

    const subjectPrompt = {
      message: 'Write a short description of the change:\n',
      name: 'subject',
      type: 'input',
      validate: (input = '') => input && (input.trim()).length > 0 ? true : 'You need to provide a short description'
    };

    const confirmAnIssuePrompt = {
      message: 'Do you want to do something with an/other issue?\n',
      name: 'confirmAnIssue',
      type: 'confirm'
    };

    const issueActionPrompt = {
      choices: issueActionChoices,
      message: `Select an action type in an issue:`,
      name: 'issueAction',
      type: 'list'
    };

    const issuePrompt = {
      message: 'Write the issue number:\n',
      name: 'issue',
      type: 'input',
      validate: (input = '') => {
        input = input.trim();

        if (!input.length) {
          return `It's necessary one digit at least`;
        }

        if (/^[0-9]+$/g.test(input)) {
          return true;
        } else {
          return 'Only numbers are allowed';
        }
      }
    };

    // methods
    const confirmAnIssues = _answers1 => {
      if (_answers1) {
        answers1 = _answers1;
      }

      const promptPromise = _cz.prompt([confirmAnIssuePrompt]);

      promptPromise.then(_answers2 => {
        const { confirmAnIssue } = _answers2;

        if (confirmAnIssue) {
          chooseAnIssues();
        } else {
          executeCommit();
        }
      });

    };

    const chooseAnIssues = () => {
      const promptPromise = _cz.prompt([issueActionPrompt, issuePrompt]);

      promptPromise.then(_answers3 => {
        const { issueAction, issue } = _answers3;

        issuesTexts += ` ${issueAction} #${issue}`;

        confirmAnIssues();
      });
    };

    const executeCommit = _answers4 => {
      const maxLineWidth = 100;

      const { type, scope, subject } = answers1;

      const trimmedScope = scope.trim();
      const appPart = trimmedScope ? `(${trimmedScope})` : '';

      const trimmedSubject = subject.trim();

      let head = `${type}${appPart}: ${trimmedSubject} ${issuesTexts}`;

      if (head.length > maxLineWidth) {
        const etcetera = ` [...]`;
        const subjectLength = trimmedSubject.length + (maxLineWidth - (head.length + etcetera.length));
        head = `${type}${appPart}: ${trimmedSubject.slice(0, subjectLength)}${etcetera}`;
      }

      _commit(head);
    }

    // follow way
    const promptPromise = _cz.prompt([typePrompt, scopePrompt, subjectPrompt]);

    promptPromise.then(confirmAnIssues);
  }
}
