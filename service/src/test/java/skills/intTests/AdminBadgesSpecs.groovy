/**
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
package skills.intTests

import skills.intTests.utils.DefaultIntSpec
import skills.intTests.utils.SkillsFactory

class AdminBadgesSpecs extends DefaultIntSpec {

    void "get badge that have skills assigned"() {
        def proj = SkillsFactory.createProject()
        def subj = SkillsFactory.createSubject()
        def skills = SkillsFactory.createSkills(4)
        def badge = SkillsFactory.createBadge()

        skillsService.createProject(proj)
        skillsService.createSubject(subj)
        skillsService.createSkills(skills)
        skillsService.assignDependency([projectId: proj.projectId, skillId: skills.get(0).skillId, dependentSkillId: skills.get(1).skillId])
        skillsService.assignDependency([projectId: proj.projectId, skillId: skills.get(0).skillId, dependentSkillId: skills.get(2).skillId])

        skillsService.createBadge(badge)
        skillsService.assignSkillToBadge([projectId: proj.projectId, badgeId: badge.badgeId, skillId: skills.get(0).skillId])
        skillsService.assignSkillToBadge([projectId: proj.projectId, badgeId: badge.badgeId, skillId: skills.get(3).skillId])

        when:
        def res = skillsService.getBadge(badge)

        then:
        res
        res.numSkills == 2
        res.requiredSkills.size() == 2
        res.requiredSkills.collect { it.skillId }.sort() == ["skill1", "skill4"]
        res.totalPoints == 20
        res.badgeId == badge.badgeId
        res.name == badge.name
        res.projectId == proj.projectId
    }

    void "assign skills to inactive badge"() {
        def proj = SkillsFactory.createProject()
        def subj = SkillsFactory.createSubject()
        def skills = SkillsFactory.createSkills(4)
        def badge = SkillsFactory.createBadge()

        skillsService.createProject(proj)
        skillsService.createSubject(subj)
        skillsService.createSkills(skills)
        skillsService.assignDependency([projectId: proj.projectId, skillId: skills.get(0).skillId, dependentSkillId: skills.get(1).skillId])
        skillsService.assignDependency([projectId: proj.projectId, skillId: skills.get(0).skillId, dependentSkillId: skills.get(2).skillId])

        badge.enabled = false
        skillsService.createBadge(badge)
        skillsService.assignSkillToBadge([projectId: proj.projectId, badgeId: badge.badgeId, skillId: skills.get(0).skillId])
        skillsService.assignSkillToBadge([projectId: proj.projectId, badgeId: badge.badgeId, skillId: skills.get(3).skillId])

        when:
        def res = skillsService.getBadge(badge)

        then:
        res
        res.numSkills == 2
        res.requiredSkills.size() == 2
        res.requiredSkills.collect { it.skillId }.sort() == ["skill1", "skill4"]
        res.totalPoints == 20
        res.badgeId == badge.badgeId
        res.name == badge.name
        res.projectId == proj.projectId
        res.enabled == 'false'
    }

    void "remove skills from a badge"() {
        def proj = SkillsFactory.createProject()
        def subj = SkillsFactory.createSubject()
        def skills = SkillsFactory.createSkills(4)
        def badge = SkillsFactory.createBadge()

        skillsService.createProject(proj)
        skillsService.createSubject(subj)
        skillsService.createSkills(skills)

        skillsService.createBadge(badge)
        skillsService.assignSkillToBadge([projectId: proj.projectId, badgeId: badge.badgeId, skillId: skills.get(0).skillId])
        Map badgeSkillDeclaration = [projectId: proj.projectId, badgeId: badge.badgeId, skillId: skills.get(3).skillId]
        skillsService.assignSkillToBadge(badgeSkillDeclaration)

        when:
        def res = skillsService.getBadge(badge)
        skillsService.removeSkillFromBadge(badgeSkillDeclaration)
        def resAfterDeletion = skillsService.getBadge(badge)
        then:
        res
        res.numSkills == 2
        res.requiredSkills.collect { it.skillId }.sort() == ["skill1", "skill4"]

        resAfterDeletion
        resAfterDeletion.numSkills == 1
        resAfterDeletion.requiredSkills.collect { it.skillId }.sort() == ["skill1"]
    }

    void "removing last unachieved skill from a badge achieves that badge"() {
        def proj = SkillsFactory.createProject()
        def subj = SkillsFactory.createSubject()
        def skills = SkillsFactory.createSkills(4, 1, 1, 100)
        def badge = SkillsFactory.createBadge()

        skillsService.createProject(proj)
        skillsService.createSubject(subj)
        skillsService.createSkills(skills)

        skillsService.createBadge(badge)
        skillsService.assignSkillToBadge([projectId: proj.projectId, badgeId: badge.badgeId, skillId: skills.get(0).skillId])
        skillsService.assignSkillToBadge([projectId: proj.projectId, badgeId: badge.badgeId, skillId: skills.get(1).skillId])
        skillsService.assignSkillToBadge([projectId: proj.projectId, badgeId: badge.badgeId, skillId: skills.get(2).skillId])
        badge.enabled = true
        skillsService.createBadge(badge)

        List<String> users = getRandomUsers(2)
        skillsService.addSkill([projectId: proj.projectId, skillId: skills.get(0).skillId], users[0], new Date())
        skillsService.addSkill([projectId: proj.projectId, skillId: skills.get(2).skillId], users[0], new Date())

        skillsService.addSkill([projectId: proj.projectId, skillId: skills.get(0).skillId], users[1], new Date())

        when:
        def u1Summary_t0 = skillsService.getBadgeSummary(users[0], proj.projectId, badge.badgeId)
        skillsService.getBadge
        skillsService.removeSkillFromBadge([projectId: proj.projectId, badgeId: badge.badgeId, skillId: skills.get(1).skillId])
        def u1Summary_t1 = skillsService.getBadgeSummary(users[0], proj.projectId, badge.badgeId)
        def u2Summary_t1 = skillsService.getBadgeSummary(users[1], proj.projectId, badge.badgeId)
        then:
        u1Summary_t0.skills.size() == 3
        u1Summary_t0.skills[0].points == u1Summary_t0.skills[0].totalPoints
        u1Summary_t0.skills[1].points < u1Summary_t0.skills[1].totalPoints
        u1Summary_t0.skills[2].points == u1Summary_t0.skills[2].totalPoints
        !u1Summary_t0.badgeAchieved

        u1Summary_t1.skills.size() == 2
        u1Summary_t1.skills[0].points == u1Summary_t0.skills[0].totalPoints
        u1Summary_t1.skills[1].points == u1Summary_t0.skills[1].totalPoints
        u1Summary_t1.badgeAchieved

        u2Summary_t1.skills.size() == 2
        u2Summary_t1.skills[0].points == u1Summary_t0.skills[0].totalPoints
        u2Summary_t1.skills[1].points < u1Summary_t0.skills[1].totalPoints
        !u2Summary_t1.badgeAchieved
    }

    void "delete last unachieved skill that was assigned to a badge - achieves that badge"() {
        def proj = SkillsFactory.createProject()
        def subj = SkillsFactory.createSubject()
        def skills = SkillsFactory.createSkills(4, 1, 1, 100)
        def badge = SkillsFactory.createBadge()

        skillsService.createProject(proj)
        skillsService.createSubject(subj)
        skillsService.createSkills(skills)

        skillsService.createBadge(badge)
        skillsService.assignSkillToBadge([projectId: proj.projectId, badgeId: badge.badgeId, skillId: skills.get(0).skillId])
        skillsService.assignSkillToBadge([projectId: proj.projectId, badgeId: badge.badgeId, skillId: skills.get(1).skillId])
        skillsService.assignSkillToBadge([projectId: proj.projectId, badgeId: badge.badgeId, skillId: skills.get(2).skillId])
        badge.enabled = true
        skillsService.createBadge(badge)

        List<String> users = getRandomUsers(2)
        skillsService.addSkill([projectId: proj.projectId, skillId: skills.get(0).skillId], users[0], new Date())
        skillsService.addSkill([projectId: proj.projectId, skillId: skills.get(2).skillId], users[0], new Date())

        skillsService.addSkill([projectId: proj.projectId, skillId: skills.get(0).skillId], users[1], new Date())

        when:
        def u1Summary_t0 = skillsService.getBadgeSummary(users[0], proj.projectId, badge.badgeId)
        skillsService.deleteSkill(skills.get(1))
        def u1Summary_t1 = skillsService.getBadgeSummary(users[0], proj.projectId, badge.badgeId)
        def u2Summary_t1 = skillsService.getBadgeSummary(users[1], proj.projectId, badge.badgeId)
        then:
        u1Summary_t0.skills.size() == 3
        u1Summary_t0.skills[0].points == u1Summary_t0.skills[0].totalPoints
        u1Summary_t0.skills[1].points < u1Summary_t0.skills[1].totalPoints
        u1Summary_t0.skills[2].points == u1Summary_t0.skills[2].totalPoints
        !u1Summary_t0.badgeAchieved

        u1Summary_t1.skills.size() == 2
        u1Summary_t1.skills[0].points == u1Summary_t0.skills[0].totalPoints
        u1Summary_t1.skills[1].points == u1Summary_t0.skills[1].totalPoints
        u1Summary_t1.badgeAchieved

        u2Summary_t1.skills.size() == 2
        u2Summary_t1.skills[0].points == u1Summary_t0.skills[0].totalPoints
        u2Summary_t1.skills[1].points < u1Summary_t0.skills[1].totalPoints
        !u2Summary_t1.badgeAchieved
    }

    void "remove badge"() {
        def proj = SkillsFactory.createProject()
        def subj = SkillsFactory.createSubject()
        def skills = SkillsFactory.createSkills(4)
        def badge = SkillsFactory.createBadge()
        def badge1 = SkillsFactory.createBadge(1, 2)

        skillsService.createProject(proj)
        skillsService.createSubject(subj)
        skillsService.createSkills(skills)

        skillsService.createBadge(badge)
        skillsService.createBadge(badge1)

        when:
        def res = skillsService.getBadges(proj.projectId)
        skillsService.removeBadge(badge1)
        def resAfterDeletion = skillsService.getBadges(proj.projectId)
        then:
        res
        res.collect { it.badgeId }.sort() == [badge.badgeId, badge1.badgeId].sort()

        resAfterDeletion
        resAfterDeletion.collect { it.badgeId } == [badge.badgeId]
    }

    void "cannot disable a badge after it has been enabled"(){
        def proj = SkillsFactory.createProject()
        def subj = SkillsFactory.createSubject()
        def skills = SkillsFactory.createSkills(4)
        def badge = SkillsFactory.createBadge()
        badge.enabled = 'true'

        skillsService.createProject(proj)
        skillsService.createSubject(subj)
        skillsService.createSkills(skills)

        skillsService.createBadge(badge)
        skillsService.assignSkillToBadge(projectId: proj.projectId, badgeId: badge.badgeId, skillId: skills.get(0).skillId)
        skillsService.updateBadge(badge, badge.badgeId)  // can only enable after initial creation

        when:
        badge = skillsService.getBadge(badge)
        badge.enabled = 'false'
        skillsService.updateBadge(badge, badge.badgeId)

        then:
        Exception ex = thrown()
        ex.getMessage().contains("Once a Badge has been published, the only allowable value for enabled is [true]")
    }

    def "cannot enable badge with no skills"() {
        def proj = SkillsFactory.createProject()
        def subj = SkillsFactory.createSubject()
        def skills = SkillsFactory.createSkills(4)
        def badge = SkillsFactory.createBadge()
        badge.enabled = 'false'

        skillsService.createProject(proj)
        skillsService.createSubject(subj)
        skillsService.createSkills(skills)

        when:
        skillsService.createBadge(badge)
        badge.enabled = 'true'
        skillsService.createBadge(badge)

        then:
        def ex = thrown(Exception)
    }
}
