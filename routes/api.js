'use strict';

module.exports = function (app) {
  function shallowEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
  
    
  
    for (let key of keys1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }
  
    return true;
  }

  const projects = {};

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
      let {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open
      } = req.query;

      if (project && !projects[project]) {
        projects[project] = [];
      }

      let issues = projects[project];

      if (_id) {
        issues = issues.filter(item => item._id == _id);
      }

      if (issue_title) {
        issues = issues.filter(item => item.issue_title == issue_title);
      }

      if (issue_text) {
        issues = issues.filter(item => item.issue_text == issue_text);
      }

      if (created_by) {
        issues = issues.filter(item => item.created_by == created_by);
      }

      if (assigned_to) {
        issues = issues.filter(item => item.assigned_to == assigned_to);
      }

      if (status_text) {
        issues = issues.filter(item => item.status_text == status_text);
      }

      if (open) {
        issues = issues.filter(item => item.open == open);
      }

      res.send(issues);
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let {
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text
      } = req.body;

      if (!issue_title || !issue_text || !created_by) {
        res.send({ error: 'required field(s) missing' });
        return;
      }

      let newIssue = {
        _id: Math.floor(Math.random() * 100000000000000000).toString(),
        issue_title,
        issue_text,
        created_by,
        assigned_to: assigned_to || '',
        status_text: status_text || '',
        open: true,
        created_on: new Date(),
        updated_on: new Date()
      }

      if (!projects[project]) {
        projects[project] = [];
      }

      projects[project].push(newIssue);

      console.log(projects[project][projects[project].length - 1]);

      res.send(newIssue);
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let {
        _id,
        issue_title,
        issue_text,
        created_by,
        assigned_to,
        status_text,
        open
      } = req.body;

      if (!_id) {
        res.send({ error: 'missing _id' });
        return;
      }

      if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && !open) {
        res.send({ error: 'no update field(s) sent', _id });
        return;
      }
       
      let issue = projects[project].find(item => item._id == _id);

      if (!issue) {
        res.send({ error: 'could not update', _id });
        return;
      }

      if (issue_title) {
        issue.issue_title = issue_title;
      }

      if (issue_text) {
        issue.issue_text = issue_text;
      }

      if (created_by) {
        issue.created_by = created_by;
      }

      if (assigned_to) {
        issue.assigned_to = assigned_to;
      }

      if (status_text) {
        issue.status_text = status_text;
      }

      if (open) {
        issue.open = open;
      }

      issue.updated_on = new Date();

      res.send({ result: 'successfully updated', _id });
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      let { _id } = req.body;

      if (!_id) {
        res.send({ error: 'missing _id' });
        return;
      }

      let issue = projects[project].find(item => item._id == _id);

      if (!issue) {
        res.send({ error: 'could not delete', _id });
        return;
      }

      projects[project] = projects[project].filter(item => item._id != _id);

      res.send({ result: 'successfully deleted', _id });
      
    });
    
};
