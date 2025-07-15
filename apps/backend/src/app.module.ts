import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AcademiesModule } from './academies/academies.module';
import { CoursesModule } from './courses/courses.module';
import { LessonsModule } from './lessons/lessons.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { AchievementsModule } from './achievements/achievements.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WebsocketModule } from './websocket/websocket.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { ReportsModule } from './reports/reports.module';
import { AttendanceModule } from './attendance/attendance.module';
import { PaymentsModule } from './payments/payments.module';
import { EventsModule } from './events/events.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { ChannelsModule } from './channels/courses.module';
import { MessagesModule } from './messages/messages.module';
import { PostsModule } from './posts/posts.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { FilesModule } from './files/files.module';
import { GroupsModule } from './groups/groups.module';
import { ProfilesModule } from './profiles/profiles.module';
import { QuestionsModule } from './questions/questions.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { BadgesModule } from './badges/badges.module';
import { CertificateModule } from './certificates/certificate.module';
import { PathsModule } from './paths/paths.module';
import { CommunitiesModule } from './communities/communities.module';
import { AccountingModule } from './accounting/accounting.module';
import { PublicRelationsModule } from './public-relations/public-relations.module';
import { SecretariatModule } from './secretariat/secretariat.module';
import { AdministrationModule } from './administration/administration.module';
import { LegalAffairsModule } from './legal-affairs/legal-affairs.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { CalendarModule } from './calendar/calendar.module';
import { CasesModule } from './cases/cases.module';
import { ContractsModule } from './contracts/contracts.module';
import { DepartmentsModule } from './departments/departments.module';
import { DocumentsModule } from './documents/documents.module';
import { MediaModule } from './media/media.module';
import { MeetingsModule } from './meetings/meetings.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { SocialMediaModule } from './social-media/social-media.module';
import { InstallmentsModule } from './installments/installments.module';
import { ExpensesModule } from './expenses/expenses.module';
import { InstructorsModule } from './instructors/instructors.module';
import { SupportModule } from './support/support.module';
import { ContactModule } from './contact/contact.module';
import { PublicModule } from './public/public.module';
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        // GraphQLModule.forRoot<ApolloDriverConfig>({
        //     driver: ApolloDriver,
        //     autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        //     sortSchema: true,
        //     playground: true,
        // }),
        ThrottlerModule.forRoot([{
            ttl: 60,
            limit: 10,
        }]),
        AuthModule,
        UsersModule,
        AcademiesModule,
        CoursesModule,
        LessonsModule,
        QuizzesModule,
        AchievementsModule,
        NotificationsModule,
        WebsocketModule,
        SubmissionsModule,
        ReportsModule,
        AttendanceModule,
        PaymentsModule,
        EventsModule,
        BookmarksModule,
        ChannelsModule,
        MessagesModule,
        PostsModule,
        EnrollmentsModule,
        FilesModule,
        GroupsModule,
        ProfilesModule,
        QuestionsModule,
        BadgesModule,
        CertificateModule,
        PathsModule,
        CommunitiesModule,
        AccountingModule,
        PublicRelationsModule,
        SecretariatModule,
        AdministrationModule,
        LegalAffairsModule,
        AdminAuthModule,
        AccountingModule,
        CalendarModule,
        CasesModule,
        ContractsModule,
        DepartmentsModule,
        DocumentsModule,
        MediaModule,
        MeetingsModule,
        PermissionsModule,
        RolesModule,
        SecretariatModule,
        SocialMediaModule,
        InstallmentsModule,
        ExpensesModule,
        InstructorsModule,
        SupportModule,
        ContactModule,
        PublicModule
    ],
    // providers: [
    //     {
    //         provide: APP_GUARD,
    //         useClass: AuthGuard,
    //     },
    // ],
})
export class AppModule { } 