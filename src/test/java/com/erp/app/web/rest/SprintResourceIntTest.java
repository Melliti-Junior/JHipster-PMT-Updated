package com.erp.app.web.rest;

import com.erp.app.DashBoardApp;

import com.erp.app.domain.Sprint;
import com.erp.app.repository.SprintRepository;
import com.erp.app.repository.search.SprintSearchRepository;
import com.erp.app.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static com.erp.app.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the SprintResource REST controller.
 *
 * @see SprintResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DashBoardApp.class)
public class SprintResourceIntTest {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_DURATION = 1;
    private static final Integer UPDATED_DURATION = 2;

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String DEFAULT_GOAL = "AAAAAAAAAA";
    private static final String UPDATED_GOAL = "BBBBBBBBBB";

    private static final Boolean DEFAULT_IS_ACTIVE = false;
    private static final Boolean UPDATED_IS_ACTIVE = true;

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private SprintSearchRepository sprintSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restSprintMockMvc;

    private Sprint sprint;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final SprintResource sprintResource = new SprintResource(sprintRepository, sprintSearchRepository);
        this.restSprintMockMvc = MockMvcBuilders.standaloneSetup(sprintResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sprint createEntity() {
        Sprint sprint = new Sprint()
            .code(DEFAULT_CODE)
            .name(DEFAULT_NAME)
            .duration(DEFAULT_DURATION)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .goal(DEFAULT_GOAL)
            .isActive(DEFAULT_IS_ACTIVE);
        return sprint;
    }

    @Before
    public void initTest() {
        sprintRepository.deleteAll();
        sprintSearchRepository.deleteAll();
        sprint = createEntity();
    }

    @Test
    public void createSprint() throws Exception {
        int databaseSizeBeforeCreate = sprintRepository.findAll().size();

        // Create the Sprint
        restSprintMockMvc.perform(post("/api/sprints")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sprint)))
            .andExpect(status().isCreated());

        // Validate the Sprint in the database
        List<Sprint> sprintList = sprintRepository.findAll();
        assertThat(sprintList).hasSize(databaseSizeBeforeCreate + 1);
        Sprint testSprint = sprintList.get(sprintList.size() - 1);
        assertThat(testSprint.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testSprint.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testSprint.getDuration()).isEqualTo(DEFAULT_DURATION);
        assertThat(testSprint.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testSprint.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testSprint.getGoal()).isEqualTo(DEFAULT_GOAL);
        assertThat(testSprint.isIsActive()).isEqualTo(DEFAULT_IS_ACTIVE);

        // Validate the Sprint in Elasticsearch
        Sprint sprintEs = sprintSearchRepository.findOne(testSprint.getId());
        assertThat(sprintEs).isEqualToIgnoringGivenFields(testSprint);
    }

    @Test
    public void createSprintWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = sprintRepository.findAll().size();

        // Create the Sprint with an existing ID
        sprint.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restSprintMockMvc.perform(post("/api/sprints")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sprint)))
            .andExpect(status().isBadRequest());

        // Validate the Sprint in the database
        List<Sprint> sprintList = sprintRepository.findAll();
        assertThat(sprintList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = sprintRepository.findAll().size();
        // set the field null
        sprint.setCode(null);

        // Create the Sprint, which fails.

        restSprintMockMvc.perform(post("/api/sprints")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sprint)))
            .andExpect(status().isBadRequest());

        List<Sprint> sprintList = sprintRepository.findAll();
        assertThat(sprintList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllSprints() throws Exception {
        // Initialize the database
        sprintRepository.save(sprint);

        // Get all the sprintList
        restSprintMockMvc.perform(get("/api/sprints?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sprint.getId())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].goal").value(hasItem(DEFAULT_GOAL.toString())))
            .andExpect(jsonPath("$.[*].isActive").value(hasItem(DEFAULT_IS_ACTIVE.booleanValue())));
    }

    @Test
    public void getSprint() throws Exception {
        // Initialize the database
        sprintRepository.save(sprint);

        // Get the sprint
        restSprintMockMvc.perform(get("/api/sprints/{id}", sprint.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(sprint.getId()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.duration").value(DEFAULT_DURATION))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.goal").value(DEFAULT_GOAL.toString()))
            .andExpect(jsonPath("$.isActive").value(DEFAULT_IS_ACTIVE.booleanValue()));
    }

    @Test
    public void getNonExistingSprint() throws Exception {
        // Get the sprint
        restSprintMockMvc.perform(get("/api/sprints/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateSprint() throws Exception {
        // Initialize the database
        sprintRepository.save(sprint);
        sprintSearchRepository.save(sprint);
        int databaseSizeBeforeUpdate = sprintRepository.findAll().size();

        // Update the sprint
        Sprint updatedSprint = sprintRepository.findOne(sprint.getId());
        updatedSprint
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .duration(UPDATED_DURATION)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .goal(UPDATED_GOAL)
            .isActive(UPDATED_IS_ACTIVE);

        restSprintMockMvc.perform(put("/api/sprints")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedSprint)))
            .andExpect(status().isOk());

        // Validate the Sprint in the database
        List<Sprint> sprintList = sprintRepository.findAll();
        assertThat(sprintList).hasSize(databaseSizeBeforeUpdate);
        Sprint testSprint = sprintList.get(sprintList.size() - 1);
        assertThat(testSprint.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testSprint.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testSprint.getDuration()).isEqualTo(UPDATED_DURATION);
        assertThat(testSprint.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testSprint.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testSprint.getGoal()).isEqualTo(UPDATED_GOAL);
        assertThat(testSprint.isIsActive()).isEqualTo(UPDATED_IS_ACTIVE);

        // Validate the Sprint in Elasticsearch
        Sprint sprintEs = sprintSearchRepository.findOne(testSprint.getId());
        assertThat(sprintEs).isEqualToIgnoringGivenFields(testSprint);
    }

    @Test
    public void updateNonExistingSprint() throws Exception {
        int databaseSizeBeforeUpdate = sprintRepository.findAll().size();

        // Create the Sprint

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restSprintMockMvc.perform(put("/api/sprints")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(sprint)))
            .andExpect(status().isCreated());

        // Validate the Sprint in the database
        List<Sprint> sprintList = sprintRepository.findAll();
        assertThat(sprintList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteSprint() throws Exception {
        // Initialize the database
        sprintRepository.save(sprint);
        sprintSearchRepository.save(sprint);
        int databaseSizeBeforeDelete = sprintRepository.findAll().size();

        // Get the sprint
        restSprintMockMvc.perform(delete("/api/sprints/{id}", sprint.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean sprintExistsInEs = sprintSearchRepository.exists(sprint.getId());
        assertThat(sprintExistsInEs).isFalse();

        // Validate the database is empty
        List<Sprint> sprintList = sprintRepository.findAll();
        assertThat(sprintList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void searchSprint() throws Exception {
        // Initialize the database
        sprintRepository.save(sprint);
        sprintSearchRepository.save(sprint);

        // Search the sprint
        restSprintMockMvc.perform(get("/api/_search/sprints?query=id:" + sprint.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sprint.getId())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].duration").value(hasItem(DEFAULT_DURATION)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].goal").value(hasItem(DEFAULT_GOAL.toString())))
            .andExpect(jsonPath("$.[*].isActive").value(hasItem(DEFAULT_IS_ACTIVE.booleanValue())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Sprint.class);
        Sprint sprint1 = new Sprint();
        sprint1.setId("id1");
        Sprint sprint2 = new Sprint();
        sprint2.setId(sprint1.getId());
        assertThat(sprint1).isEqualTo(sprint2);
        sprint2.setId("id2");
        assertThat(sprint1).isNotEqualTo(sprint2);
        sprint1.setId(null);
        assertThat(sprint1).isNotEqualTo(sprint2);
    }
}
