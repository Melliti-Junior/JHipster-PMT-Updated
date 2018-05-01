package com.erp.app.web.rest;

import com.erp.app.DashBoardApp;

import com.erp.app.domain.Workflow;
import com.erp.app.repository.WorkflowRepository;
import com.erp.app.repository.search.WorkflowSearchRepository;
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

import java.util.List;

import static com.erp.app.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the WorkflowResource REST controller.
 *
 * @see WorkflowResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DashBoardApp.class)
public class WorkflowResourceIntTest {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private WorkflowRepository workflowRepository;

    @Autowired
    private WorkflowSearchRepository workflowSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restWorkflowMockMvc;

    private Workflow workflow;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final WorkflowResource workflowResource = new WorkflowResource(workflowRepository, workflowSearchRepository);
        this.restWorkflowMockMvc = MockMvcBuilders.standaloneSetup(workflowResource)
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
    public static Workflow createEntity() {
        Workflow workflow = new Workflow()
            .code(DEFAULT_CODE)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION);
        return workflow;
    }

    @Before
    public void initTest() {
        workflowRepository.deleteAll();
        workflowSearchRepository.deleteAll();
        workflow = createEntity();
    }

    @Test
    public void createWorkflow() throws Exception {
        int databaseSizeBeforeCreate = workflowRepository.findAll().size();

        // Create the Workflow
        restWorkflowMockMvc.perform(post("/api/workflows")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workflow)))
            .andExpect(status().isCreated());

        // Validate the Workflow in the database
        List<Workflow> workflowList = workflowRepository.findAll();
        assertThat(workflowList).hasSize(databaseSizeBeforeCreate + 1);
        Workflow testWorkflow = workflowList.get(workflowList.size() - 1);
        assertThat(testWorkflow.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testWorkflow.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testWorkflow.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);

        // Validate the Workflow in Elasticsearch
        Workflow workflowEs = workflowSearchRepository.findOne(testWorkflow.getId());
        assertThat(workflowEs).isEqualToIgnoringGivenFields(testWorkflow);
    }

    @Test
    public void createWorkflowWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = workflowRepository.findAll().size();

        // Create the Workflow with an existing ID
        workflow.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restWorkflowMockMvc.perform(post("/api/workflows")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workflow)))
            .andExpect(status().isBadRequest());

        // Validate the Workflow in the database
        List<Workflow> workflowList = workflowRepository.findAll();
        assertThat(workflowList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = workflowRepository.findAll().size();
        // set the field null
        workflow.setCode(null);

        // Create the Workflow, which fails.

        restWorkflowMockMvc.perform(post("/api/workflows")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workflow)))
            .andExpect(status().isBadRequest());

        List<Workflow> workflowList = workflowRepository.findAll();
        assertThat(workflowList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllWorkflows() throws Exception {
        // Initialize the database
        workflowRepository.save(workflow);

        // Get all the workflowList
        restWorkflowMockMvc.perform(get("/api/workflows?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(workflow.getId())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    public void getWorkflow() throws Exception {
        // Initialize the database
        workflowRepository.save(workflow);

        // Get the workflow
        restWorkflowMockMvc.perform(get("/api/workflows/{id}", workflow.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(workflow.getId()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    public void getNonExistingWorkflow() throws Exception {
        // Get the workflow
        restWorkflowMockMvc.perform(get("/api/workflows/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateWorkflow() throws Exception {
        // Initialize the database
        workflowRepository.save(workflow);
        workflowSearchRepository.save(workflow);
        int databaseSizeBeforeUpdate = workflowRepository.findAll().size();

        // Update the workflow
        Workflow updatedWorkflow = workflowRepository.findOne(workflow.getId());
        updatedWorkflow
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION);

        restWorkflowMockMvc.perform(put("/api/workflows")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedWorkflow)))
            .andExpect(status().isOk());

        // Validate the Workflow in the database
        List<Workflow> workflowList = workflowRepository.findAll();
        assertThat(workflowList).hasSize(databaseSizeBeforeUpdate);
        Workflow testWorkflow = workflowList.get(workflowList.size() - 1);
        assertThat(testWorkflow.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testWorkflow.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testWorkflow.getDescription()).isEqualTo(UPDATED_DESCRIPTION);

        // Validate the Workflow in Elasticsearch
        Workflow workflowEs = workflowSearchRepository.findOne(testWorkflow.getId());
        assertThat(workflowEs).isEqualToIgnoringGivenFields(testWorkflow);
    }

    @Test
    public void updateNonExistingWorkflow() throws Exception {
        int databaseSizeBeforeUpdate = workflowRepository.findAll().size();

        // Create the Workflow

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restWorkflowMockMvc.perform(put("/api/workflows")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(workflow)))
            .andExpect(status().isCreated());

        // Validate the Workflow in the database
        List<Workflow> workflowList = workflowRepository.findAll();
        assertThat(workflowList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteWorkflow() throws Exception {
        // Initialize the database
        workflowRepository.save(workflow);
        workflowSearchRepository.save(workflow);
        int databaseSizeBeforeDelete = workflowRepository.findAll().size();

        // Get the workflow
        restWorkflowMockMvc.perform(delete("/api/workflows/{id}", workflow.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean workflowExistsInEs = workflowSearchRepository.exists(workflow.getId());
        assertThat(workflowExistsInEs).isFalse();

        // Validate the database is empty
        List<Workflow> workflowList = workflowRepository.findAll();
        assertThat(workflowList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void searchWorkflow() throws Exception {
        // Initialize the database
        workflowRepository.save(workflow);
        workflowSearchRepository.save(workflow);

        // Search the workflow
        restWorkflowMockMvc.perform(get("/api/_search/workflows?query=id:" + workflow.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(workflow.getId())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Workflow.class);
        Workflow workflow1 = new Workflow();
        workflow1.setId("id1");
        Workflow workflow2 = new Workflow();
        workflow2.setId(workflow1.getId());
        assertThat(workflow1).isEqualTo(workflow2);
        workflow2.setId("id2");
        assertThat(workflow1).isNotEqualTo(workflow2);
        workflow1.setId(null);
        assertThat(workflow1).isNotEqualTo(workflow2);
    }
}
