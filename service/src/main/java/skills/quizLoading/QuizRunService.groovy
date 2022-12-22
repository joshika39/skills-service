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
package skills.quizLoading

import groovy.util.logging.Slf4j
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import skills.controller.exceptions.ErrorCode
import skills.controller.exceptions.SkillQuizException
import skills.quizLoading.model.QuizAnswerOptionsInfo
import skills.quizLoading.model.QuizInfo
import skills.quizLoading.model.QuizQuestionInfo
import skills.storage.model.QuizAnswerDef
import skills.storage.model.QuizDef
import skills.storage.model.QuizDefWithDescription
import skills.storage.model.QuizQuestionDef
import skills.storage.repos.QuizAnswerRepo
import skills.storage.repos.QuizDefWithDescRepo
import skills.storage.repos.QuizQuestionRepo

@Service
@Slf4j
class QuizRunService {

    @Autowired
    QuizDefWithDescRepo quizDefWithDescRepo

    @Autowired
    QuizQuestionRepo quizQuestionRepo

    @Autowired
    QuizAnswerRepo quizAnswerRepo

    QuizInfo loadQuizInfo(String quizId) {
        QuizDefWithDescription updatedDef = quizDefWithDescRepo.findByQuizIdIgnoreCase(quizId)
        if (!updatedDef) {
            throw new SkillQuizException("Failed to find quiz id.", quizId, ErrorCode.BadParam)
        }

        List<QuizQuestionDef> dbQuestionDefs = quizQuestionRepo.findAllByQuizIdIgnoreCase(quizId)
        List<QuizAnswerDef> dbAnswersDef = quizAnswerRepo.findAllByQuizIdIgnoreCase(quizId)
        Map<Integer, List<QuizAnswerDef>> byQuizId = dbAnswersDef.groupBy {it.questionRefId }

        List<QuizQuestionInfo> questions = dbQuestionDefs.collect {
            List<QuizAnswerDef> quizAnswerDefs = byQuizId[it.id]
            new QuizQuestionInfo(
                    id: it.id,
                    question: it.question,
                    canSelectMoreThanOne: quizAnswerDefs.count({Boolean.valueOf(it.isCorrectAnswer)}) > 1,
                    answerOptions: quizAnswerDefs.collect {
                        new QuizAnswerOptionsInfo(
                                id: it.id,
                                answerOption: it.answer
                        )
                    }
            )
        }

        return new QuizInfo(
                name: updatedDef.name,
                description: updatedDef.description,
                questions: questions,
        )
    }
}
