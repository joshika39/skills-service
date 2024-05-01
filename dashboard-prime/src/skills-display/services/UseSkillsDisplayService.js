import axios from 'axios'
import { useSkillsDisplayAttributesState } from '@/skills-display/stores/UseSkillsDisplayAttributesState.js'
import { useRoute } from 'vue-router'

export const useSkillsDisplayService = () => {
  const servicePath = '/api/projects'
  const attributes = useSkillsDisplayAttributesState()
  const route = useRoute()

  const getUserIdAndVersionParams = () => {
    // const params = this.getUserIdParams();
    // params.version = this.version;
    //
    // return params;
    return {}
  }

  const loadSubjectSummary = (subjectId, includeSkills = true) => {
    const params = getUserIdAndVersionParams()
    params.includeSkills = includeSkills
    return axios.get(`${attributes.serviceUrl}${servicePath}/${encodeURIComponent(attributes.projectId)}/subjects/${encodeURIComponent(subjectId)}/summary`, {
      params
    }).then((result) => {
      return addMetaToSummary(result.data)
    })
  }

  const addMetaToSummary = (summary) => {
    const res = summary
    res.skills = res.skills.map((item) => {
      const skillRes = addMeta(item)
      const isSkillsGroupType = item.type === 'SkillsGroup'
      if (isSkillsGroupType) {

        if (item.children) {
          skillRes.children = skillRes.children.map((child) => addMeta(child, item.skillId))
          const numSkillsRequired = skillRes.numSkillsRequired === -1 ? skillRes.children.length : skillRes.numSkillsRequired
          const numSkillsCompleted = skillRes.children.filter((childSkill) => childSkill.meta.complete).length
          skillRes.meta.complete = numSkillsCompleted >= numSkillsRequired
        }
      }

      return skillRes
    })
    return res
  }

  const addMeta = (skill, groupId = null) => {
    const isSkillsGroupType = skill.type === 'SkillsGroup'
    const copy = {
      ...skill,
      isSkillsGroupType,
      isSkillType: !isSkillsGroupType,
      groupId
    }
    copy.meta = {
      complete: skill.points >= skill.totalPoints,
      withoutProgress: skill.points === 0,
      inProgress: skill.points > 0 && skill.points < skill.totalPoints,
      pendingApproval: skill.selfReporting && skill.selfReporting.requestedOn && !skill.selfReporting.rejectedOn,
      belongsToBadge: skill.badges && skill.badges.length > 0,
      hasTag: skill.tags && skill.tags.length > 0,
      approval: skill.selfReporting && skill.selfReporting.type === 'Approval',
      honorSystem: skill.selfReporting && skill.selfReporting.type === 'HonorSystem',
      quiz: skill.selfReporting && skill.selfReporting.type === 'Quiz',
      survey: skill.selfReporting && skill.selfReporting.type === 'Survey',
      video: skill.selfReporting && skill.selfReporting.type === 'Video',
      subjectId: route.params.subjectId
    }
    return copy
  }


  const updateSkillHistory = (projectId, skillId) => {
    return axios.post(`${attributes.serviceUrl}${servicePath}/${encodeURIComponent(projectId)}/skills/visited/${encodeURIComponent(skillId)}`).then((res) => res.data)
  }

  const getSkillSummary = (skillId, optionalCrossProjectId, subjectId) => {
    let url = `${attributes.serviceUrl}${servicePath}/${encodeURIComponent(attributes.projectId)}/`
    if (optionalCrossProjectId) {
      url += `projects/${encodeURIComponent(optionalCrossProjectId)}/`
    }

    if (subjectId) {
      url += `subjects/${subjectId}/`
    }
    url += `skills/${encodeURIComponent(skillId)}/summary`

    return axios.get(url, {
      params: getUserIdAndVersionParams(),
      withCredentials: true
    }).then((result) => addMeta(result.data))
  }

  const searchSkills = (query) => {
    return axios.get(`${attributes.serviceUrl}${servicePath}/${encodeURIComponent(attributes.projectId)}/skills`, {
      params: ({ ...getUserIdAndVersionParams(), query, limit: 5 })
    }).then((result) => result.data)
  }

  const getDescriptions = (parentId, type = 'subject') => {
    let url = `${attributes.serviceUrl}${servicePath}/${encodeURIComponent(attributes.projectId)}/subjects/${encodeURIComponent(parentId)}/descriptions`
    if (type === 'badge' || type === 'global-badge') {
      url = `${attributes.serviceUrl}${servicePath}/${encodeURIComponent(attributes.projectId)}/badges/${encodeURIComponent(parentId)}/descriptions`
    }
    const response = axios.get(url, {
      params: {
        ...getUserIdAndVersionParams(),
        global: type === 'global-badge'
      }
    }).then((result) => result.data)
    return response
  }

  const reportSkill = (skillId, approvalRequestedMsg) => {
    return axios.post(`${attributes.serviceUrl}${servicePath}/${encodeURIComponent(attributes.projectId)}/skills/${encodeURIComponent(skillId)}`, {
      ...getUserIdAndVersionParams(),
      approvalRequestedMsg
    }, { handleErrorCode: 400 }).then((result) => result.data)
  }

  const removeApprovalRejection = (rejectionId) => {
    return axios.delete(`${attributes.serviceUrl}${servicePath}/${encodeURIComponent(attributes.projectId)}/rejections/${encodeURIComponent(rejectionId)}`, {
      params: getUserIdAndVersionParams()
    }).then((result) => result.data)
  }

  const getBadgeSummaries = () => {
    return axios.get(`${attributes.serviceUrl}${servicePath}/${encodeURIComponent(attributes.projectId)}/badges/summary`, {
      params: getUserIdAndVersionParams(),
    }).then((result) => result.data.map((summary) => addMetaToSummary(summary)));
  }

  const getBadgeSkills = (badgeId, global = null, includeSkills = true) => {
    const requestParams = getUserIdAndVersionParams();
    requestParams.global = global;
    requestParams.includeSkills = includeSkills;
    return axios.get(`${attributes.serviceUrl}${servicePath}/${encodeURIComponent(attributes.projectId)}/badges/${encodeURIComponent(badgeId)}/summary`, {
      params: requestParams,
    }).then((result) => {
      if (includeSkills) {
        const res = addMetaToSummary(result.data);
        if (res.projectLevelsAndSkillsSummaries) {
          res.projectLevelsAndSkillsSummaries = res.projectLevelsAndSkillsSummaries.map((summary) => addMetaToSummary(summary));
        }
        return res;
      }
      return result.data;
    })
  }

  const getSkillDependencies = (skillId) => {
    return axios.get(`${attributes.serviceUrl}${servicePath}/${encodeURIComponent(attributes.projectId)}/skills/${encodeURIComponent(skillId)}/dependencies`, {
      params: getUserIdAndVersionParams(),
    }).then((result) => result.data);
  }

  return {
    loadSubjectSummary,
    updateSkillHistory,
    getSkillSummary,
    searchSkills,
    getDescriptions,
    reportSkill,
    removeApprovalRejection,
    getBadgeSummaries,
    getBadgeSkills,
    getSkillDependencies
  }
}