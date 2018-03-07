package com.erp.app.web.rest;

import com.erp.app.DashBoardApp;

import com.erp.app.domain.IssueType;
import com.erp.app.repository.IssueTypeRepository;
import com.erp.app.repository.search.IssueTypeSearchRepository;
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
 * Test class for the IssueTypeResource REST controller.
 *
 * @see IssueTypeResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DashBoardApp.class)
public class IssueTypeResourceIntTest {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String DEFAULT_ICON = "AAAAAAAAAA";
    private static final String UPDATED_ICON = "BBBBBBBBBB";

    @Autowired
    private IssueTypeRepository issueTypeRepository;

    @Autowired
    private IssueTypeSearchRepository issueTypeSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restIssueTypeMockMvc;

    private IssueType issueType;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final IssueTypeResource issueTypeResource = new IssueTypeResource(issueTypeRepository, issueTypeSearchRepository);
        this.restIssueTypeMockMvc = MockMvcBuilders.standaloneSetup(issueTypeResource)
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
    public static IssueType createEntity() {
        IssueType issueType = new IssueType()
            .code(DEFAULT_CODE)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .icon(DEFAULT_ICON);
        return issueType;
    }

    @Before
    public void initTest() {
        issueTypeRepository.deleteAll();
        issueTypeSearchRepository.deleteAll();
        issueType = createEntity();
    }

    @Test
    public void createIssueType() throws Exception {
        int databaseSizeBeforeCreate = issueTypeRepository.findAll().size();

        // Create the IssueType
        restIssueTypeMockMvc.perform(post("/api/issue-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(issueType)))
            .andExpect(status().isCreated());

        // Validate the IssueType in the database
        List<IssueType> issueTypeList = issueTypeRepository.findAll();
        assertThat(issueTypeList).hasSize(databaseSizeBeforeCreate + 1);
        IssueType testIssueType = issueTypeList.get(issueTypeList.size() - 1);
        assertThat(testIssueType.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testIssueType.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testIssueType.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testIssueType.getIcon()).isEqualTo(DEFAULT_ICON);

        // Validate the IssueType in Elasticsearch
        IssueType issueTypeEs = issueTypeSearchRepository.findOne(testIssueType.getId());
        assertThat(issueTypeEs).isEqualToIgnoringGivenFields(testIssueType);
    }

    @Test
    public void createIssueTypeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = issueTypeRepository.findAll().size();

        // Create the IssueType with an existing ID
        issueType.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restIssueTypeMockMvc.perform(post("/api/issue-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(issueType)))
            .andExpect(status().isBadRequest());

        // Validate the IssueType in the database
        List<IssueType> issueTypeList = issueTypeRepository.findAll();
        assertThat(issueTypeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = issueTypeRepository.findAll().size();
        // set the field null
        issueType.setCode(null);

        // Create the IssueType, which fails.

        restIssueTypeMockMvc.perform(post("/api/issue-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(issueType)))
            .andExpect(status().isBadRequest());

        List<IssueType> issueTypeList = issueTypeRepository.findAll();
        assertThat(issueTypeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllIssueTypes() throws Exception {
        // Initialize the database
        issueTypeRepository.save(issueType);

        // Get all the issueTypeList
        restIssueTypeMockMvc.perform(get("/api/issue-types?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(issueType.getId())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].icon").value(hasItem(DEFAULT_ICON.toString())));
    }

    @Test
    public void getIssueType() throws Exception {
        // Initialize the database
        issueTypeRepository.save(issueType);

        // Get the issueType
        restIssueTypeMockMvc.perform(get("/api/issue-types/{id}", issueType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(issueType.getId()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.icon").value(DEFAULT_ICON.toString()));
    }

    @Test
    public void getNonExistingIssueType() throws Exception {
        // Get the issueType
        restIssueTypeMockMvc.perform(get("/api/issue-types/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateIssueType() throws Exception {
        // Initialize the database
        issueTypeRepository.save(issueType);
        issueTypeSearchRepository.save(issueType);
        int databaseSizeBeforeUpdate = issueTypeRepository.findAll().size();

        // Update the issueType
        IssueType updatedIssueType = issueTypeRepository.findOne(issueType.getId());
        updatedIssueType
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .icon(UPDATED_ICON);

        restIssueTypeMockMvc.perform(put("/api/issue-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedIssueType)))
            .andExpect(status().isOk());

        // Validate the IssueType in the database
        List<IssueType> issueTypeList = issueTypeRepository.findAll();
        assertThat(issueTypeList).hasSize(databaseSizeBeforeUpdate);
        IssueType testIssueType = issueTypeList.get(issueTypeList.size() - 1);
        assertThat(testIssueType.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testIssueType.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testIssueType.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testIssueType.getIcon()).isEqualTo(UPDATED_ICON);

        // Validate the IssueType in Elasticsearch
        IssueType issueTypeEs = issueTypeSearchRepository.findOne(testIssueType.getId());
        assertThat(issueTypeEs).isEqualToIgnoringGivenFields(testIssueType);
    }

    @Test
    public void updateNonExistingIssueType() throws Exception {
        int databaseSizeBeforeUpdate = issueTypeRepository.findAll().size();

        // Create the IssueType

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restIssueTypeMockMvc.perform(put("/api/issue-types")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(issueType)))
            .andExpect(status().isCreated());

        // Validate the IssueType in the database
        List<IssueType> issueTypeList = issueTypeRepository.findAll();
        assertThat(issueTypeList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteIssueType() throws Exception {
        // Initialize the database
        issueTypeRepository.save(issueType);
        issueTypeSearchRepository.save(issueType);
        int databaseSizeBeforeDelete = issueTypeRepository.findAll().size();

        // Get the issueType
        restIssueTypeMockMvc.perform(delete("/api/issue-types/{id}", issueType.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean issueTypeExistsInEs = issueTypeSearchRepository.exists(issueType.getId());
        assertThat(issueTypeExistsInEs).isFalse();

        // Validate the database is empty
        List<IssueType> issueTypeList = issueTypeRepository.findAll();
        assertThat(issueTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void searchIssueType() throws Exception {
        // Initialize the database
        issueTypeRepository.save(issueType);
        issueTypeSearchRepository.save(issueType);

        // Search the issueType
        restIssueTypeMockMvc.perform(get("/api/_search/issue-types?query=id:" + issueType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(issueType.getId())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].icon").value(hasItem(DEFAULT_ICON.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(IssueType.class);
        IssueType issueType1 = new IssueType();
        issueType1.setId("id1");
        IssueType issueType2 = new IssueType();
        issueType2.setId(issueType1.getId());
        assertThat(issueType1).isEqualTo(issueType2);
        issueType2.setId("id2");
        assertThat(issueType1).isNotEqualTo(issueType2);
        issueType1.setId(null);
        assertThat(issueType1).isNotEqualTo(issueType2);
    }
}
