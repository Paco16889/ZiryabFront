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
                                <a href="components/AssistanceListComponent.html" data-type="entity-link" >AssistanceListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AssistanceListItemComponent.html" data-type="entity-link" >AssistanceListItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BotonAtrasComponent.html" data-type="entity-link" >BotonAtrasComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BotonCloseComponent.html" data-type="entity-link" >BotonCloseComponent</a>
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
                                <a href="components/BotonHamburguesaComponent.html" data-type="entity-link" >BotonHamburguesaComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/BotonViewdetailComponent.html" data-type="entity-link" >BotonViewdetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ClasesComponent.html" data-type="entity-link" >ClasesComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ClasesProfesorComponent.html" data-type="entity-link" >ClasesProfesorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ClassSessionListComponent.html" data-type="entity-link" >ClassSessionListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ClassSessionListItemComponent.html" data-type="entity-link" >ClassSessionListItemComponent</a>
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
                                <a href="components/ListComponent.html" data-type="entity-link" >ListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ListItemComponent.html" data-type="entity-link" >ListItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
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
                                <a href="components/StudentTaskListComponent.html" data-type="entity-link" >StudentTaskListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/StudentTaskListItemComponent.html" data-type="entity-link" >StudentTaskListItemComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SubjectComponent.html" data-type="entity-link" >SubjectComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SubjectCreateFormComponent.html" data-type="entity-link" >SubjectCreateFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TaskListComponent.html" data-type="entity-link" >TaskListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TaskListItemComponent.html" data-type="entity-link" >TaskListItemComponent</a>
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
                                <a href="components/TemarioComponent.html" data-type="entity-link" >TemarioComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UnauthorizedComponent.html" data-type="entity-link" >UnauthorizedComponent</a>
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
                                    <a href="injectables/AssistanceServiceService.html" data-type="entity-link" >AssistanceServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ClasesService.html" data-type="entity-link" >ClasesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ClassSessionServiceService.html" data-type="entity-link" >ClassSessionServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CourseServiceService.html" data-type="entity-link" >CourseServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FloatMenuService.html" data-type="entity-link" >FloatMenuService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GroupServiceService.html" data-type="entity-link" >GroupServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ListRefreshServiceService.html" data-type="entity-link" >ListRefreshServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalStorageAuthService.html" data-type="entity-link" >LocalStorageAuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ModalDeleteServiceService.html" data-type="entity-link" >ModalDeleteServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ModalEditServiceService.html" data-type="entity-link" >ModalEditServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NavigationService.html" data-type="entity-link" >NavigationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PasswordServiceService.html" data-type="entity-link" >PasswordServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PerfilMenuService.html" data-type="entity-link" >PerfilMenuService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SelectedStudentServiceService.html" data-type="entity-link" >SelectedStudentServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StudentRegistrationService.html" data-type="entity-link" >StudentRegistrationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StudentsServiceService.html" data-type="entity-link" >StudentsServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/StudentTaskServiceService.html" data-type="entity-link" >StudentTaskServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SubjectServiceService.html" data-type="entity-link" >SubjectServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TaskServiceService.html" data-type="entity-link" >TaskServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TeachersServiceService.html" data-type="entity-link" >TeachersServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ToggleService.html" data-type="entity-link" >ToggleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WeekScheduleServiceService.html" data-type="entity-link" >WeekScheduleServiceService</a>
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
                                <a href="interfaces/ApiResponse.html" data-type="entity-link" >ApiResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Assignment.html" data-type="entity-link" >Assignment</a>
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
                                <a href="interfaces/AssignmentUpdateRequest.html" data-type="entity-link" >AssignmentUpdateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssignmentUpdateResponse.html" data-type="entity-link" >AssignmentUpdateResponse</a>
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
                                <a href="interfaces/AssistancesAllResponse.html" data-type="entity-link" >AssistancesAllResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssistanceUpdateRequest.html" data-type="entity-link" >AssistanceUpdateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AssistanceUpdateResponse.html" data-type="entity-link" >AssistanceUpdateResponse</a>
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
                                <a href="interfaces/CoursesAllResponse.html" data-type="entity-link" >CoursesAllResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CourseUpdateRequest.html" data-type="entity-link" >CourseUpdateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CourseUpdateResponse.html" data-type="entity-link" >CourseUpdateResponse</a>
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
                                <a href="interfaces/EditFieldConfig.html" data-type="entity-link" >EditFieldConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Enrollment.html" data-type="entity-link" >Enrollment</a>
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
                                <a href="interfaces/EnrollmentUpdateRequest.html" data-type="entity-link" >EnrollmentUpdateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EnrollmentUpdateResponse.html" data-type="entity-link" >EnrollmentUpdateResponse</a>
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
                                <a href="interfaces/RegisterInfo.html" data-type="entity-link" >RegisterInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Student.html" data-type="entity-link" >Student</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentByIdResponse.html" data-type="entity-link" >StudentByIdResponse</a>
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
                                <a href="interfaces/StudentTask.html" data-type="entity-link" >StudentTask</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/StudentTaskByIdResponse.html" data-type="entity-link" >StudentTaskByIdResponse</a>
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
                                <a href="interfaces/TeachersAllResponse.html" data-type="entity-link" >TeachersAllResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeacherUpdateRequest.html" data-type="entity-link" >TeacherUpdateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TeacherUpdateResponse.html" data-type="entity-link" >TeacherUpdateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateModalState.html" data-type="entity-link" >UpdateModalState</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateRequest.html" data-type="entity-link" >UpdateRequest</a>
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
                                <a href="interfaces/WeekScheduleByIdResponse.html" data-type="entity-link" >WeekScheduleByIdResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleCreateRequest.html" data-type="entity-link" >WeekScheduleCreateRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleCreateResponse.html" data-type="entity-link" >WeekScheduleCreateResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekScheduleDeleteResponse.html" data-type="entity-link" >WeekScheduleDeleteResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeekSchedulesAllResponse.html" data-type="entity-link" >WeekSchedulesAllResponse</a>
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