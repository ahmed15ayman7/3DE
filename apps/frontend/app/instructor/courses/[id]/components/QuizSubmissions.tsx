import { useQuery } from '@tanstack/react-query';
import { quizApi, submissionApi } from '@/lib/api';
import { Option, Question, Quiz, Submission, User, UserRole } from '@shared/prisma';

interface QuizSubmissionsProps {
    quizId: string;
}

let initialSubmissions: (Submission & { user: User, quiz: Quiz & { questions: Question[] } })[] = [
    {
        id: '1',
        userId: '1',
        quizId: '1',
        score: 10,
        feedback: 'Good job',
        passed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        quiz: {
            id: '1',
            title: 'Quiz 1',
            questions: [
                {
                    id: '1',
                    text: 'Question 1',
                    points: 10,
                    createdAt: new Date(),
                    type: 'multiple_choice',
                    isAnswered: true,
                    quizId: '1',
                    isMultiple: true,
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
            description: 'Quiz 1',
            lessonId: '1',
            timeLimit: 10,
            passingScore: 10,
            upComing: false,
            isCompleted: false,
        },
        answers: [
            {
                questionId: '1',
                optionId: '1',
            }
        ],
        user: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '1234567890',
            age: 20,
            role: UserRole.STUDENT,
            subRole: 'student',
            createdAt: new Date(),
            updatedAt: new Date(),
            password: '1234567890',
            avatar: 'https://via.placeholder.com/150',
            isOnline: true,
            isVerified: true,
            academyId: '1',
        }
    }
]

export default function QuizSubmissions({ quizId }: QuizSubmissionsProps) {
    const { data: submissionsResponse, isLoading } = useQuery({
        queryKey: ['quiz-submissions', quizId],
        queryFn: () => submissionApi.getByQuiz(quizId),
    });

    if (isLoading) {
        return (
            <div className="flex justify-center p-6">
                <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!submissionsResponse?.data || submissionsResponse.data.length === 0) {
        return (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded p-4 text-center">
                لم يتم تقديم أي إجابات بعد
            </div>
        );
    }

    const submissions = submissionsResponse.data ?? initialSubmissions;

    return (
        <div className="bg-white rounded shadow p-6 overflow-x-auto">
            <h2 className="text-lg font-bold mb-4">نتائج الطلاب</h2>
            <table className="min-w-full border text-sm">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="py-2 px-4 border-b">اسم الطالب</th>
                        <th className="py-2 px-4 border-b text-center">النتيجة</th>
                        <th className="py-2 px-4 border-b text-center">النسبة المئوية</th>
                        <th className="py-2 px-4 border-b text-center">تاريخ التقديم</th>
                    </tr>
                </thead>
                <tbody>
                    {submissions.map((submission) => {
                        let fullScore = 0;
                        for (let question of submission.quiz.questions) {
                            fullScore += question.points;
                        }
                        return (
                            <tr key={submission.id} className="even:bg-gray-50">
                                <td className="py-2 px-4 border-b">{submission.user.firstName} {submission.user.lastName}</td>
                                <td className="py-2 px-4 border-b text-center">
                                    {submission.score} من {fullScore}
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    {fullScore > 0 ? Math.round(((submission.score ?? 0) / fullScore) * 100) : 0}%
                                </td>
                                <td className="py-2 px-4 border-b text-center">
                                    {new Date(submission.createdAt).toLocaleDateString('ar-SA')}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
} 