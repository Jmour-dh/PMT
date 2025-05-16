package com.PMT.Backend_PMT.unitTest;

import org.junit.platform.suite.api.SelectClasses;
import org.junit.platform.suite.api.Suite;
import org.junit.platform.suite.api.SuiteDisplayName;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@Suite
@SuiteDisplayName("PMT Test Suite")
@SelectClasses({
        AuthControllerTest.class,
        UserControllerTest.class,
        ProjectControllerTest.class,
        TaskControllerTest.class,
        TaskHistoryControllerTest.class,
        ProjectMemberControllerTest.class
})
public class UnitTestSuiteTest {
    // La classe peut rester vide
}