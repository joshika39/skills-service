import axios from 'axios';

export default {
  subjectWithNameExists(projectId, subjectName) {
    return axios.get(`/admin/projects/${projectId}/subjectExists?subjectName=${encodeURIComponent(subjectName)}`)
      .then(remoteRes => !remoteRes.data);
  },
  subjectWithIdExists(projectId, subjectId) {
    return axios.get(`/admin/projects/${projectId}/subjectExists?subjectId=${subjectId}`)
      .then(remoteRes => !remoteRes.data);
  },
  getSubjectDetails(projectId, subjectId) {
    return axios.get(`/admin/projects/${projectId}/subjects/${subjectId}`)
      .then(res => res.data);
  },
  getSubjects(projectId) {
    return axios.get(`/admin/projects/${projectId}/subjects`)
      .then(res => res.data);
  },
  saveSubject(subject) {
    return axios.post(`/admin/projects/${subject.projectId}/subjects/${subject.subjectId}`, subject)
      .then(res => res.data);
  },
  patchSubject(subject, actionToSubmit) {
    axios.patch(`/admin/projects/${subject.projectId}/subjects/${subject.subjectId}`, { action: actionToSubmit })
      .then(res => res.data);
  },
  deleteSubject(subject) {
    return axios.delete(`/admin/projects/${subject.projectId}/subjects/${subject.subjectId}`);
  },
};
