'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">login-en-angular documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AboutComponent.html" data-type="entity-link" >AboutComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AdminMenuComponent.html" data-type="entity-link" >AdminMenuComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AsignaturaListComponent.html" data-type="entity-link" >AsignaturaListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AsignaturaListItemComponent.html" data-type="entity-link" >AsignaturaListItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AssistanceCreateFormComponent.html" data-type="entity-link" >AssistanceCreateFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AssistanceListComponent.html" data-type="entity-link" >AssistanceListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AssistanceListItemComponent.html" data-type="entity-link" >AssistanceListItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BotonAtrasComponent.html" data-type="entity-link" >BotonAtrasComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BotonConfirmarStudentComponent.html" data-type="entity-link" >BotonConfirmarStudentComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BotonCreateComponent.html" data-type="entity-link" >BotonCreateComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BotonDeleteComponent.html" data-type="entity-link" >BotonDeleteComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BotonEditComponent.html" data-type="entity-link" >BotonEditComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BotonfaltaComponent.html" data-type="entity-link" >BotonfaltaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BotonHamburguesaComponent.html" data-type="entity-link" >BotonHamburguesaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BotonViewdetailComponent.html" data-type="entity-link" >BotonViewdetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CalendarioComponent.html" data-type="entity-link" >CalendarioComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CalificarTareaComponent.html" data-type="entity-link" >CalificarTareaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CardGridComponent.html" data-type="entity-link" >CardGridComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ClasesComponent.html" data-type="entity-link" >ClasesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ClasesProfesorComponent.html" data-type="entity-link" >ClasesProfesorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ClassSessionCancelDialogComponent.html" data-type="entity-link" >ClassSessionCancelDialogComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ClassSessionCreateFormComponent.html" data-type="entity-link" >ClassSessionCreateFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ClassSessionListComponent.html" data-type="entity-link" >ClassSessionListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ClassSessionListItemComponent.html" data-type="entity-link" >ClassSessionListItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CourseAssignmentsGridComponent.html" data-type="entity-link" >CourseAssignmentsGridComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CourseAssignmentsWizardComponent.html" data-type="entity-link" >CourseAssignmentsWizardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CourseCreateFormComponent.html" data-type="entity-link" >CourseCreateFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CourseListComponent.html" data-type="entity-link" >CourseListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CourseListItemComponent.html" data-type="entity-link" >CourseListItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardAdminComponent.html" data-type="entity-link" >DashboardAdminComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DashboardComponent.html" data-type="entity-link" >DashboardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/DesplegableAdminComponent.html" data-type="entity-link" >DesplegableAdminComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/EntregasTareaComponent.html" data-type="entity-link" >EntregasTareaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FichaProfesorComponent.html" data-type="entity-link" >FichaProfesorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FichaUsuarioComponent.html" data-type="entity-link" >FichaUsuarioComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FilterSectionComponent.html" data-type="entity-link" >FilterSectionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FooterComponent.html" data-type="entity-link" >FooterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GenericDeleteModalComponent.html" data-type="entity-link" >GenericDeleteModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GenericEditModalComponent.html" data-type="entity-link" >GenericEditModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GenericListItemComponent.html" data-type="entity-link" >GenericListItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GenericViewDetailComponent.html" data-type="entity-link" >GenericViewDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GestionComponent.html" data-type="entity-link" >GestionComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GestionNotasComponent.html" data-type="entity-link" >GestionNotasComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GroupCreateFormComponent.html" data-type="entity-link" >GroupCreateFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GroupListComponent.html" data-type="entity-link" >GroupListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/GroupListItemComponent.html" data-type="entity-link" >GroupListItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HeaderComponent.html" data-type="entity-link" >HeaderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HorarioAlumnoComponent.html" data-type="entity-link" >HorarioAlumnoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HorarioProfesorComponent.html" data-type="entity-link" >HorarioProfesorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/InformeAdminComponent.html" data-type="entity-link" >InformeAdminComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/JustificarFaltaModalComponent.html" data-type="entity-link" >JustificarFaltaModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ListaasistenciaComponent.html" data-type="entity-link" >ListaasistenciaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ListComponent.html" data-type="entity-link" >ListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ListItemComponent.html" data-type="entity-link" >ListItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MenuClaseComponent.html" data-type="entity-link" >MenuClaseComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MisNotasComponent.html" data-type="entity-link" >MisNotasComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotificationBadgeComponent.html" data-type="entity-link" >NotificationBadgeComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotificationCreateFormComponent.html" data-type="entity-link" >NotificationCreateFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotificationListComponent.html" data-type="entity-link" >NotificationListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotificationListComponent-1.html" data-type="entity-link" >NotificationListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotificationListItemComponent.html" data-type="entity-link" >NotificationListItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NotificationListItemComponent-1.html" data-type="entity-link" >NotificationListItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PerfilComponent.html" data-type="entity-link" >PerfilComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SelectorIdiomaComponent.html" data-type="entity-link" >SelectorIdiomaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SetRegistrationComponent.html" data-type="entity-link" >SetRegistrationComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StudentAbsencesModalComponent.html" data-type="entity-link" >StudentAbsencesModalComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StudentCreateFormComponent.html" data-type="entity-link" >StudentCreateFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StudentEnrollmentComponent.html" data-type="entity-link" >StudentEnrollmentComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StudentModeSelectorComponent.html" data-type="entity-link" >StudentModeSelectorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StudentSelectorComponent.html" data-type="entity-link" >StudentSelectorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StudentTaskCreateFormComponent.html" data-type="entity-link" >StudentTaskCreateFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StudentTaskDetailComponent.html" data-type="entity-link" >StudentTaskDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StudentTaskGroupComponent.html" data-type="entity-link" >StudentTaskGroupComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StudentTaskListComponent.html" data-type="entity-link" >StudentTaskListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StudentTaskListComponent-1.html" data-type="entity-link" >StudentTaskListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StudentTaskListItemComponent.html" data-type="entity-link" >StudentTaskListItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StudentTaskListItemComponent-1.html" data-type="entity-link" >StudentTaskListItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SubjectComponent.html" data-type="entity-link" >SubjectComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SubjectCreateFormComponent.html" data-type="entity-link" >SubjectCreateFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TarjetaasistenciaComponent.html" data-type="entity-link" >TarjetaasistenciaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TaskCreateFormComponent.html" data-type="entity-link" >TaskCreateFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TaskDetailComponent.html" data-type="entity-link" >TaskDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TaskFormComponent.html" data-type="entity-link" >TaskFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TaskGroupItemComponent.html" data-type="entity-link" >TaskGroupItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TaskListComponent.html" data-type="entity-link" >TaskListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TaskListComponent-1.html" data-type="entity-link" >TaskListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TaskListItemComponent.html" data-type="entity-link" >TaskListItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TaskListItemComponent-1.html" data-type="entity-link" >TaskListItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TeacherCreateFormComponent.html" data-type="entity-link" >TeacherCreateFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TeacherListComponent.html" data-type="entity-link" >TeacherListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TeacherListItemComponent.html" data-type="entity-link" >TeacherListItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TemarioAlumnoComponent.html" data-type="entity-link" >TemarioAlumnoComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TemarioProfesorComponent.html" data-type="entity-link" >TemarioProfesorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TutorAssignmentComponent.html" data-type="entity-link" >TutorAssignmentComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UnauthorizedComponent.html" data-type="entity-link" >UnauthorizedComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WeekScheduleAssignmentPickerComponent.html" data-type="entity-link" >WeekScheduleAssignmentPickerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WeekScheduleBuilderComponent.html" data-type="entity-link" >WeekScheduleBuilderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WeekScheduleCreateClassSelectComponent.html" data-type="entity-link" >WeekScheduleCreateClassSelectComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WeekScheduleCreateSlotsComponent.html" data-type="entity-link" >WeekScheduleCreateSlotsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WeekScheduleCreateTemplateComponent.html" data-type="entity-link" >WeekScheduleCreateTemplateComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WeekScheduleCreateWeekdaysComponent.html" data-type="entity-link" >WeekScheduleCreateWeekdaysComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WeekScheduleDayCardComponent.html" data-type="entity-link" >WeekScheduleDayCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WeekScheduleGridBuilderComponent.html" data-type="entity-link" >WeekScheduleGridBuilderComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WeekScheduleHourCardComponent.html" data-type="entity-link" >WeekScheduleHourCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WeekScheduleListComponent.html" data-type="entity-link" >WeekScheduleListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/WeekScheduleListItemComponent.html" data-type="entity-link" >WeekScheduleListItemComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AdminNotificationService.html" data-type="entity-link" >AdminNotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AdminTaskService.html" data-type="entity-link" >AdminTaskService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AnalyticsHttpService.html" data-type="entity-link" >AnalyticsHttpService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AssignmentHttpService.html" data-type="entity-link" >AssignmentHttpService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AssignmentsService.html" data-type="entity-link" >AssignmentsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AssistanceService.html" data-type="entity-link" >AssistanceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AssistanceService-1.html" data-type="entity-link" >AssistanceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AttendanceService.html" data-type="entity-link" >AttendanceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthStorageService.html" data-type="entity-link" >AuthStorageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CargaStudentsporGrupoAsignaturaService.html" data-type="entity-link" >CargaStudentsporGrupoAsignaturaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ClasesService.html" data-type="entity-link" >ClasesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ClassSessionService.html" data-type="entity-link" >ClassSessionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CourseGroupService.html" data-type="entity-link" >CourseGroupService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CourseService.html" data-type="entity-link" >CourseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CreateStudentTaskService.html" data-type="entity-link" >CreateStudentTaskService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EnrollmentHttpService.html" data-type="entity-link" >EnrollmentHttpService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FirebaseAuthService.html" data-type="entity-link" >FirebaseAuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FloatMenuService.html" data-type="entity-link" >FloatMenuService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GradeService.html" data-type="entity-link" >GradeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GroupService.html" data-type="entity-link" >GroupService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ListRefreshService.html" data-type="entity-link" >ListRefreshService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ModalDeleteService.html" data-type="entity-link" >ModalDeleteService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ModalEditService.html" data-type="entity-link" >ModalEditService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NavigationService.html" data-type="entity-link" >NavigationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationRepository.html" data-type="entity-link" >NotificationRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationService.html" data-type="entity-link" >NotificationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationsService.html" data-type="entity-link" >NotificationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationToggleService.html" data-type="entity-link" >NotificationToggleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PasswordService.html" data-type="entity-link" >PasswordService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PerfilMenuService.html" data-type="entity-link" >PerfilMenuService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SelectedStudentService.html" data-type="entity-link" >SelectedStudentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StudentRegistrationService.html" data-type="entity-link" >StudentRegistrationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StudentsService.html" data-type="entity-link" >StudentsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StudentTaskService.html" data-type="entity-link" >StudentTaskService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StudentTaskService-1.html" data-type="entity-link" >StudentTaskService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SubjectService.html" data-type="entity-link" >SubjectService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TaskGroupUiService.html" data-type="entity-link" >TaskGroupUiService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TaskService.html" data-type="entity-link" >TaskService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TaskService-1.html" data-type="entity-link" >TaskService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TeachersService.html" data-type="entity-link" >TeachersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ToggleService.html" data-type="entity-link" >ToggleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WeekScheduleAssignmentDataService.html" data-type="entity-link" >WeekScheduleAssignmentDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WeekScheduleClassesHttpService.html" data-type="entity-link" >WeekScheduleClassesHttpService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WeekScheduleService.html" data-type="entity-link" >WeekScheduleService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RoleGuard.html" data-type="entity-link" >RoleGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AnalyticsAlumnosCicloRow.html" data-type="entity-link" >AnalyticsAlumnosCicloRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AnalyticsAlumnosGrupoRow.html" data-type="entity-link" >AnalyticsAlumnosGrupoRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AnalyticsAsistenciaRow.html" data-type="entity-link" >AnalyticsAsistenciaRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AnalyticsExportParams.html" data-type="entity-link" >AnalyticsExportParams</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AnalyticsProfesoresRow.html" data-type="entity-link" >AnalyticsProfesoresRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AnalyticsSummary.html" data-type="entity-link" >AnalyticsSummary</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AnalyticsSummaryResponse.html" data-type="entity-link" >AnalyticsSummaryResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AnalyticsTareasRow.html" data-type="entity-link" >AnalyticsTareasRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiMessage.html" data-type="entity-link" >ApiMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiNotification.html" data-type="entity-link" >ApiNotification</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiResponse.html" data-type="entity-link" >ApiResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ApiSuccessResponse.html" data-type="entity-link" >ApiSuccessResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AppNotification.html" data-type="entity-link" >AppNotification</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Assignment.html" data-type="entity-link" >Assignment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssignmentBulkCreateItem.html" data-type="entity-link" >AssignmentBulkCreateItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssignmentByIdResponse.html" data-type="entity-link" >AssignmentByIdResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssignmentCreateRequest.html" data-type="entity-link" >AssignmentCreateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssignmentCreateResponse.html" data-type="entity-link" >AssignmentCreateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssignmentDeleteResponse.html" data-type="entity-link" >AssignmentDeleteResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssignmentsAllResponse.html" data-type="entity-link" >AssignmentsAllResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssignmentsWithIncludesResponse.html" data-type="entity-link" >AssignmentsWithIncludesResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssignmentUpdateRequest.html" data-type="entity-link" >AssignmentUpdateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssignmentUpdateResponse.html" data-type="entity-link" >AssignmentUpdateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssignmentWithIncludes.html" data-type="entity-link" >AssignmentWithIncludes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssignTutorResponse.html" data-type="entity-link" >AssignTutorResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Assistance.html" data-type="entity-link" >Assistance</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssistanceByIdResponse.html" data-type="entity-link" >AssistanceByIdResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssistanceCreateRequest.html" data-type="entity-link" >AssistanceCreateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssistanceCreateResponse.html" data-type="entity-link" >AssistanceCreateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssistanceDeleteResponse.html" data-type="entity-link" >AssistanceDeleteResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssistanceItem.html" data-type="entity-link" >AssistanceItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssistanceResponse.html" data-type="entity-link" >AssistanceResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssistancesAllResponse.html" data-type="entity-link" >AssistancesAllResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssistanceUpdateRequest.html" data-type="entity-link" >AssistanceUpdateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssistanceUpdateResponse.html" data-type="entity-link" >AssistanceUpdateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AttendanceRecord.html" data-type="entity-link" >AttendanceRecord</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BloqueTemario.html" data-type="entity-link" >BloqueTemario</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BloqueTemario-1.html" data-type="entity-link" >BloqueTemario</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BulkCreateGradesRequest.html" data-type="entity-link" >BulkCreateGradesRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CardItem.html" data-type="entity-link" >CardItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClassSession.html" data-type="entity-link" >ClassSession</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClassSessionByIdResponse.html" data-type="entity-link" >ClassSessionByIdResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClassSessionCreateRequest.html" data-type="entity-link" >ClassSessionCreateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClassSessionCreateResponse.html" data-type="entity-link" >ClassSessionCreateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClassSessionDeleteResponse.html" data-type="entity-link" >ClassSessionDeleteResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClassSessionsAllResponse.html" data-type="entity-link" >ClassSessionsAllResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClassSessionUpdateRequest.html" data-type="entity-link" >ClassSessionUpdateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ClassSessionUpdateResponse.html" data-type="entity-link" >ClassSessionUpdateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Course.html" data-type="entity-link" >Course</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CourseAssignmentGridRow.html" data-type="entity-link" >CourseAssignmentGridRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CourseAssignmentsContext.html" data-type="entity-link" >CourseAssignmentsContext</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CourseByIdResponse.html" data-type="entity-link" >CourseByIdResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CourseCreateRequest.html" data-type="entity-link" >CourseCreateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CourseCreateResponse.html" data-type="entity-link" >CourseCreateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CourseDeleteResponse.html" data-type="entity-link" >CourseDeleteResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CourseGroup.html" data-type="entity-link" >CourseGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CourseGroupRow.html" data-type="entity-link" >CourseGroupRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CourseGroupsResponse.html" data-type="entity-link" >CourseGroupsResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CourseOption.html" data-type="entity-link" >CourseOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CoursesAllResponse.html" data-type="entity-link" >CoursesAllResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CourseUpdateRequest.html" data-type="entity-link" >CourseUpdateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CourseUpdateResponse.html" data-type="entity-link" >CourseUpdateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateGradeRequest.html" data-type="entity-link" >CreateGradeRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateTaskRequest.html" data-type="entity-link" >CreateTaskRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateTaskResponse.html" data-type="entity-link" >CreateTaskResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Credentials.html" data-type="entity-link" >Credentials</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteModalState.html" data-type="entity-link" >DeleteModalState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteRequest.html" data-type="entity-link" >DeleteRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DeleteTaskResponse.html" data-type="entity-link" >DeleteTaskResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EditFieldConfig.html" data-type="entity-link" >EditFieldConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Enrollment.html" data-type="entity-link" >Enrollment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnrollmentByFiltersResponse.html" data-type="entity-link" >EnrollmentByFiltersResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnrollmentByIdResponse.html" data-type="entity-link" >EnrollmentByIdResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnrollmentCreateRequest.html" data-type="entity-link" >EnrollmentCreateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnrollmentCreateResponse.html" data-type="entity-link" >EnrollmentCreateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnrollmentDeleteResponse.html" data-type="entity-link" >EnrollmentDeleteResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnrollmentsAllResponse.html" data-type="entity-link" >EnrollmentsAllResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnrollmentsForScheduleContextResponse.html" data-type="entity-link" >EnrollmentsForScheduleContextResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnrollmentUpdateRequest.html" data-type="entity-link" >EnrollmentUpdateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnrollmentUpdateResponse.html" data-type="entity-link" >EnrollmentUpdateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnrollmentWithSubjectAndGroup.html" data-type="entity-link" >EnrollmentWithSubjectAndGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetAsignaturasAlumnoResponse.html" data-type="entity-link" >GetAsignaturasAlumnoResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetAsignaturasProfesorResponse.html" data-type="entity-link" >GetAsignaturasProfesorResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetSubjectDetailResponse.html" data-type="entity-link" >GetSubjectDetailResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetTaskByIdResponse.html" data-type="entity-link" >GetTaskByIdResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GetTasksResponse.html" data-type="entity-link" >GetTasksResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Grade.html" data-type="entity-link" >Grade</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GridCellState.html" data-type="entity-link" >GridCellState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Group.html" data-type="entity-link" >Group</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GroupByIdResponse.html" data-type="entity-link" >GroupByIdResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GroupCreateRequest.html" data-type="entity-link" >GroupCreateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GroupCreateResponse.html" data-type="entity-link" >GroupCreateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GroupDeleteResponse.html" data-type="entity-link" >GroupDeleteResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GroupOption.html" data-type="entity-link" >GroupOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GroupsAllResponse.html" data-type="entity-link" >GroupsAllResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GroupUpdateRequest.html" data-type="entity-link" >GroupUpdateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GroupUpdateResponse.html" data-type="entity-link" >GroupUpdateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListItemConfig.html" data-type="entity-link" >ListItemConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ListItemFieldConfig.html" data-type="entity-link" >ListItemFieldConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/LoginResponse.html" data-type="entity-link" >LoginResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MyGradesResponse.html" data-type="entity-link" >MyGradesResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Notification.html" data-type="entity-link" >Notification</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NotificationCreateRequest.html" data-type="entity-link" >NotificationCreateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NotificationDeleteResponse.html" data-type="entity-link" >NotificationDeleteResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NotificationsListResponse.html" data-type="entity-link" >NotificationsListResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NotificationsListResponse-1.html" data-type="entity-link" >NotificationsListResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NotificationsListResponse-2.html" data-type="entity-link" >NotificationsListResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NotificationUpdatePayload.html" data-type="entity-link" >NotificationUpdatePayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PendingJustification.html" data-type="entity-link" >PendingJustification</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/PendingJustificationsResponse.html" data-type="entity-link" >PendingJustificationsResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RecipientOption.html" data-type="entity-link" >RecipientOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterInfo.html" data-type="entity-link" >RegisterInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SelectOption.html" data-type="entity-link" >SelectOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SessionAttendanceEntry.html" data-type="entity-link" >SessionAttendanceEntry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SessionSuspendCountResponse.html" data-type="entity-link" >SessionSuspendCountResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SessionSuspendFilters.html" data-type="entity-link" >SessionSuspendFilters</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Student.html" data-type="entity-link" >Student</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentAbsencesData.html" data-type="entity-link" >StudentAbsencesData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentByFiltersRequest.html" data-type="entity-link" >StudentByFiltersRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentByIdResponse.html" data-type="entity-link" >StudentByIdResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentBySubject.html" data-type="entity-link" >StudentBySubject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentCreateRequest.html" data-type="entity-link" >StudentCreateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentCreateResponse.html" data-type="entity-link" >StudentCreateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentDeleteResponse.html" data-type="entity-link" >StudentDeleteResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentRegistration.html" data-type="entity-link" >StudentRegistration</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentRegistrationRequest.html" data-type="entity-link" >StudentRegistrationRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentRegistrationResponse.html" data-type="entity-link" >StudentRegistrationResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentsAllResponse.html" data-type="entity-link" >StudentsAllResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentsBySubjectResponse.html" data-type="entity-link" >StudentsBySubjectResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentSubjectCardSource.html" data-type="entity-link" >StudentSubjectCardSource</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentSubjectEnrollmentRow.html" data-type="entity-link" >StudentSubjectEnrollmentRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentTask.html" data-type="entity-link" >StudentTask</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentTask-1.html" data-type="entity-link" >StudentTask</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentTaskByIdResponse.html" data-type="entity-link" >StudentTaskByIdResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentTaskCreateBulkRequest.html" data-type="entity-link" >StudentTaskCreateBulkRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentTaskCreateBulkResponse.html" data-type="entity-link" >StudentTaskCreateBulkResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentTaskCreateRequest.html" data-type="entity-link" >StudentTaskCreateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentTaskCreateResponse.html" data-type="entity-link" >StudentTaskCreateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentTaskDeleteResponse.html" data-type="entity-link" >StudentTaskDeleteResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentTasksAllResponse.html" data-type="entity-link" >StudentTasksAllResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentTaskUpdateRequest.html" data-type="entity-link" >StudentTaskUpdateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentTaskUpdateResponse.html" data-type="entity-link" >StudentTaskUpdateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentUpdateRequest.html" data-type="entity-link" >StudentUpdateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentUpdateResponse.html" data-type="entity-link" >StudentUpdateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentWithSubjects.html" data-type="entity-link" >StudentWithSubjects</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Subject.html" data-type="entity-link" >Subject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubjectByIdResponse.html" data-type="entity-link" >SubjectByIdResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubjectCreateRequest.html" data-type="entity-link" >SubjectCreateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubjectCreateResponse.html" data-type="entity-link" >SubjectCreateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubjectDeleteResponse.html" data-type="entity-link" >SubjectDeleteResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubjectDetail.html" data-type="entity-link" >SubjectDetail</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubjectGroupYearKey.html" data-type="entity-link" >SubjectGroupYearKey</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubjectInGroupForYearSlice.html" data-type="entity-link" >SubjectInGroupForYearSlice</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubjectsAllResponse.html" data-type="entity-link" >SubjectsAllResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubjectUpdateRequest.html" data-type="entity-link" >SubjectUpdateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/SubjectUpdateResponse.html" data-type="entity-link" >SubjectUpdateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Task.html" data-type="entity-link" >Task</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Task-1.html" data-type="entity-link" >Task</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TaskByIdResponse.html" data-type="entity-link" >TaskByIdResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TaskCreateRequest.html" data-type="entity-link" >TaskCreateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TaskCreateResponse.html" data-type="entity-link" >TaskCreateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TaskDeleteResponse.html" data-type="entity-link" >TaskDeleteResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TaskGroup.html" data-type="entity-link" >TaskGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TaskGroupView.html" data-type="entity-link" >TaskGroupView</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TasksAllResponse.html" data-type="entity-link" >TasksAllResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TaskUpdateRequest.html" data-type="entity-link" >TaskUpdateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TaskUpdateResponse.html" data-type="entity-link" >TaskUpdateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Teacher.html" data-type="entity-link" >Teacher</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeacherAssignment.html" data-type="entity-link" >TeacherAssignment</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeacherByIdResponse.html" data-type="entity-link" >TeacherByIdResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeacherCreateRequest.html" data-type="entity-link" >TeacherCreateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeacherCreateResponse.html" data-type="entity-link" >TeacherCreateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeacherDeleteResponse.html" data-type="entity-link" >TeacherDeleteResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeacherOption.html" data-type="entity-link" >TeacherOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeachersAllResponse.html" data-type="entity-link" >TeachersAllResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeacherSubjectAssignmentRow.html" data-type="entity-link" >TeacherSubjectAssignmentRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeacherUpdateRequest.html" data-type="entity-link" >TeacherUpdateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeacherUpdateResponse.html" data-type="entity-link" >TeacherUpdateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TimetableSlot.html" data-type="entity-link" >TimetableSlot</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TutoredCourseGroup.html" data-type="entity-link" >TutoredCourseGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateModalState.html" data-type="entity-link" >UpdateModalState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateRequest.html" data-type="entity-link" >UpdateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateTaskRequest.html" data-type="entity-link" >UpdateTaskRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateTaskResponse.html" data-type="entity-link" >UpdateTaskResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UserResponse.html" data-type="entity-link" >UserResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ViewDetailConfig.html" data-type="entity-link" >ViewDetailConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ViewDetailFieldConfig.html" data-type="entity-link" >ViewDetailFieldConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekSchedule.html" data-type="entity-link" >WeekSchedule</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleApi.html" data-type="entity-link" >WeekScheduleApi</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleAssignmentWithIncludes.html" data-type="entity-link" >WeekScheduleAssignmentWithIncludes</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleByIdApiResponse.html" data-type="entity-link" >WeekScheduleByIdApiResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleByIdResponse.html" data-type="entity-link" >WeekScheduleByIdResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleClassCourseRef.html" data-type="entity-link" >WeekScheduleClassCourseRef</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleClassesResponse.html" data-type="entity-link" >WeekScheduleClassesResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleClassGroupRef.html" data-type="entity-link" >WeekScheduleClassGroupRef</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleClassItem.html" data-type="entity-link" >WeekScheduleClassItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleCreateApiRequest.html" data-type="entity-link" >WeekScheduleCreateApiRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleCreateApiResponse.html" data-type="entity-link" >WeekScheduleCreateApiResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleCreateRequest.html" data-type="entity-link" >WeekScheduleCreateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleCreateResponse.html" data-type="entity-link" >WeekScheduleCreateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleCreateSlotRow.html" data-type="entity-link" >WeekScheduleCreateSlotRow</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleDeleteResponse.html" data-type="entity-link" >WeekScheduleDeleteResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleMaterializeRequest.html" data-type="entity-link" >WeekScheduleMaterializeRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleMaterializeSlot.html" data-type="entity-link" >WeekScheduleMaterializeSlot</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleNestedGroup.html" data-type="entity-link" >WeekScheduleNestedGroup</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleNestedSubject.html" data-type="entity-link" >WeekScheduleNestedSubject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleNestedTeacher.html" data-type="entity-link" >WeekScheduleNestedTeacher</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekSchedulesAllApiResponse.html" data-type="entity-link" >WeekSchedulesAllApiResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekSchedulesAllResponse.html" data-type="entity-link" >WeekSchedulesAllResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleUpdateApiRequest.html" data-type="entity-link" >WeekScheduleUpdateApiRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleUpdateApiResponse.html" data-type="entity-link" >WeekScheduleUpdateApiResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleUpdateRequest.html" data-type="entity-link" >WeekScheduleUpdateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleUpdateResponse.html" data-type="entity-link" >WeekScheduleUpdateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WithId.html" data-type="entity-link" >WithId</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});