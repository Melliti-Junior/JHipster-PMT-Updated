package com.erp.app.web.rest;

import com.erp.app.DashBoardApp;

import com.erp.app.domain.IssuePriority;
import com.erp.app.repository.IssuePriorityRepository;
import com.erp.app.repository.search.IssuePrioritySearchRepository;
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
 * Test class for the IssuePriorityResource REST controller.
 *
 * @see IssuePriorityResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DashBoardApp.class)
public class IssuePriorityResourceIntTest {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_COLOR = "AAAAAAAAAA";
    private static final String UPDATED_COLOR = "BBBBBBBBBB";

    @Autowired
    private IssuePriorityRepository issuePriorityRepository;

    @Autowired
    private IssuePrioritySearchRepository issuePrioritySearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restIssuePriorityMockMvc;

    private IssuePriority issuePriority;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final IssuePriorityResource issuePriorityResource = new IssuePriorityResource(issuePriorityRepository, issuePrioritySearchRepository);
        this.restIssuePriorityMockMvc = MockMvcBuilders.standaloneSetup(issuePriorityResource)
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
    public static IssuePriority createEntity() {
        IssuePriority issuePriority = new IssuePriority()
            .code(DEFAULT_CODE)
            .name(DEFAULT_NAME)
            .color(DEFAULT_COLOR);
        return issuePriority;
    }

    @Before
    public void initTest() {
        issuePriorityRepository.deleteAll();
        issuePrioritySearchRepository.deleteAll();
        issuePriority = createEntity();
    }

    @Test
    public void createIssuePriority() throws Exception {
        int databaseSizeBeforeCreate = issuePriorityRepository.findAll().size();

        // Create the IssuePriority
        restIssuePriorityMockMvc.perform(post("/api/issue-priorities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(issuePriority)))
            .andExpect(status().isCreated());

        // Validate the IssuePriority in the database
        List<IssuePriority> issuePriorityList = issuePriorityRepository.findAll();
        assertThat(issuePriorityList).hasSize(databaseSizeBeforeCreate + 1);
        IssuePriority testIssuePriority = issuePriorityList.get(issuePriorityList.size() - 1);
        assertThat(testIssuePriority.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testIssuePriority.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testIssuePriority.getColor()).isEqualTo(DEFAULT_COLOR);

        // Validate the IssuePriority in Elasticsearch
        IssuePriority issuePriorityEs = issuePrioritySearchRepository.findOne(testIssuePriority.getId());
        assertThat(issuePriorityEs).isEqualToIgnoringGivenFields(testIssuePriority);
    }

    @Test
    public void createIssuePriorityWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = issuePriorityRepository.findAll().size();

        // Create the IssuePriority with an existing ID
        issuePriority.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restIssuePriorityMockMvc.perform(post("/api/issue-priorities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(issuePriority)))
            .andExpect(status().isBadRequest());

        // Validate the IssuePriority in the database
        List<IssuePriority> issuePriorityList = issuePriorityRepository.findAll();
        assertThat(issuePriorityList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = issuePriorityRepository.findAll().size();
        // set the field null
        issuePriority.setCode(null);

        // Create the IssuePriority, which fails.

        restIssuePriorityMockMvc.perform(post("/api/issue-priorities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(issuePriority)))
            .andExpect(status().isBadRequest());

        List<IssuePriority> issuePriorityList = issuePriorityRepository.findAll();
        assertThat(issuePriorityList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllIssuePriorities() throws Exception {
        // Initialize the database
        issuePriorityRepository.save(issuePriority);

        // Get all the issuePriorityList
        restIssuePriorityMockMvc.perform(get("/api/issue-priorities?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(issuePriority.getId())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].color").value(hasItem(DEFAULT_COLOR.toString())));
    }

    @Test
    public void getIssuePriority() throws Exception {
        // Initialize the database
        issuePriorityRepository.save(issuePriority);

        // Get the issuePriority
        restIssuePriorityMockMvc.perform(get("/api/issue-priorities/{id}", issuePriority.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(issuePriority.getId()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.color").value(DEFAULT_COLOR.toString()));
    }

    @Test
    public void getNonExistingIssuePriority() throws Exception {
        // Get the issuePriority
        restIssuePriorityMockMvc.perform(get("/api/issue-priorities/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateIssuePriority() throws Exception {
        // Initialize the database
        issuePriorityRepository.save(issuePriority);
        issuePrioritySearchRepository.save(issuePriority);
        int databaseSizeBeforeUpdate = issuePriorityRepository.findAll().size();

        // Update the issuePriority
        IssuePriority updatedIssuePriority = issuePriorityRepository.findOne(issuePriority.getId());
        updatedIssuePriority
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .color(UPDATED_COLOR);

        restIssuePriorityMockMvc.perform(put("/api/issue-priorities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedIssuePriority)))
            .andExpect(status().isOk());

        // Validate the IssuePriority in the database
        List<IssuePriority> issuePriorityList = issuePriorityRepository.findAll();
        assertThat(issuePriorityList).hasSize(databaseSizeBeforeUpdate);
        IssuePriority testIssuePriority = issuePriorityList.get(issuePriorityList.size() - 1);
        assertThat(testIssuePriority.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testIssuePriority.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testIssuePriority.getColor()).isEqualTo(UPDATED_COLOR);

        // Validate the IssuePriority in Elasticsearch
        IssuePriority issuePriorityEs = issuePrioritySearchRepository.findOne(testIssuePriority.getId());
        assertThat(issuePriorityEs).isEqualToIgnoringGivenFields(testIssuePriority);
    }

    @Test
    public void updateNonExistingIssuePriority() throws Exception {
        int databaseSizeBeforeUpdate = issuePriorityRepository.findAll().size();

        // Create the IssuePriority

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restIssuePriorityMockMvc.perform(put("/api/issue-priorities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(issuePriority)))
            .andExpect(status().isCreated());

        // Validate the IssuePriority in the database
        List<IssuePriority> issuePriorityList = issuePriorityRepository.findAll();
        assertThat(issuePriorityList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteIssuePriority() throws Exception {
        // Initialize the database
        issuePriorityRepository.save(issuePriority);
        issuePrioritySearchRepository.save(issuePriority);
        int databaseSizeBeforeDelete = issuePriorityRepository.findAll().size();

        // Get the issuePriority
        restIssuePriorityMockMvc.perform(delete("/api/issue-priorities/{id}", issuePriority.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean issuePriorityExistsInEs = issuePrioritySearchRepository.exists(issuePriority.getId());
        assertThat(issuePriorityExistsInEs).isFalse();

        // Validate the database is empty
        List<IssuePriority> issuePriorityList = issuePriorityRepository.findAll();
        assertThat(issuePriorityList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void searchIssuePriority() throws Exception {
        // Initialize the database
        issuePriorityRepository.save(issuePriority);
        issuePrioritySearchRepository.save(issuePriority);

        // Search the issuePriority
        restIssuePriorityMockMvc.perform(get("/api/_search/issue-priorities?query=id:" + issuePriority.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(issuePriority.getId())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].color").value(hasItem(DEFAULT_COLOR.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(IssuePriority.class);
        IssuePriority issuePriority1 = new IssuePriority();
        issuePriority1.setId("id1");
        IssuePriority issuePriority2 = new IssuePriority();
        issuePriority2.setId(issuePriority1.getId());
        assertThat(issuePriority1).isEqualTo(issuePriority2);
        issuePriority2.setId("id2");
        assertThat(issuePriority1).isNotEqualTo(issuePriority2);
        issuePriority1.setId(null);
        assertThat(issuePriority1).isNotEqualTo(issuePriority2);
    }
}
