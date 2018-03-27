package com.erp.app.web.rest;

import com.erp.app.DashBoardApp;

import com.erp.app.domain.Resolution;
import com.erp.app.repository.ResolutionRepository;
import com.erp.app.repository.search.ResolutionSearchRepository;
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
 * Test class for the ResolutionResource REST controller.
 *
 * @see ResolutionResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = DashBoardApp.class)
public class ResolutionResourceIntTest {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    @Autowired
    private ResolutionRepository resolutionRepository;

    @Autowired
    private ResolutionSearchRepository resolutionSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    private MockMvc restResolutionMockMvc;

    private Resolution resolution;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ResolutionResource resolutionResource = new ResolutionResource(resolutionRepository, resolutionSearchRepository);
        this.restResolutionMockMvc = MockMvcBuilders.standaloneSetup(resolutionResource)
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
    public static Resolution createEntity() {
        Resolution resolution = new Resolution()
            .code(DEFAULT_CODE)
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION);
        return resolution;
    }

    @Before
    public void initTest() {
        resolutionRepository.deleteAll();
        resolutionSearchRepository.deleteAll();
        resolution = createEntity();
    }

    @Test
    public void createResolution() throws Exception {
        int databaseSizeBeforeCreate = resolutionRepository.findAll().size();

        // Create the Resolution
        restResolutionMockMvc.perform(post("/api/resolutions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(resolution)))
            .andExpect(status().isCreated());

        // Validate the Resolution in the database
        List<Resolution> resolutionList = resolutionRepository.findAll();
        assertThat(resolutionList).hasSize(databaseSizeBeforeCreate + 1);
        Resolution testResolution = resolutionList.get(resolutionList.size() - 1);
        assertThat(testResolution.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testResolution.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testResolution.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);

        // Validate the Resolution in Elasticsearch
        Resolution resolutionEs = resolutionSearchRepository.findOne(testResolution.getId());
        assertThat(resolutionEs).isEqualToIgnoringGivenFields(testResolution);
    }

    @Test
    public void createResolutionWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = resolutionRepository.findAll().size();

        // Create the Resolution with an existing ID
        resolution.setId("existing_id");

        // An entity with an existing ID cannot be created, so this API call must fail
        restResolutionMockMvc.perform(post("/api/resolutions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(resolution)))
            .andExpect(status().isBadRequest());

        // Validate the Resolution in the database
        List<Resolution> resolutionList = resolutionRepository.findAll();
        assertThat(resolutionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    public void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = resolutionRepository.findAll().size();
        // set the field null
        resolution.setCode(null);

        // Create the Resolution, which fails.

        restResolutionMockMvc.perform(post("/api/resolutions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(resolution)))
            .andExpect(status().isBadRequest());

        List<Resolution> resolutionList = resolutionRepository.findAll();
        assertThat(resolutionList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    public void getAllResolutions() throws Exception {
        // Initialize the database
        resolutionRepository.save(resolution);

        // Get all the resolutionList
        restResolutionMockMvc.perform(get("/api/resolutions?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(resolution.getId())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    public void getResolution() throws Exception {
        // Initialize the database
        resolutionRepository.save(resolution);

        // Get the resolution
        restResolutionMockMvc.perform(get("/api/resolutions/{id}", resolution.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(resolution.getId()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE.toString()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()));
    }

    @Test
    public void getNonExistingResolution() throws Exception {
        // Get the resolution
        restResolutionMockMvc.perform(get("/api/resolutions/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    public void updateResolution() throws Exception {
        // Initialize the database
        resolutionRepository.save(resolution);
        resolutionSearchRepository.save(resolution);
        int databaseSizeBeforeUpdate = resolutionRepository.findAll().size();

        // Update the resolution
        Resolution updatedResolution = resolutionRepository.findOne(resolution.getId());
        updatedResolution
            .code(UPDATED_CODE)
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION);

        restResolutionMockMvc.perform(put("/api/resolutions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedResolution)))
            .andExpect(status().isOk());

        // Validate the Resolution in the database
        List<Resolution> resolutionList = resolutionRepository.findAll();
        assertThat(resolutionList).hasSize(databaseSizeBeforeUpdate);
        Resolution testResolution = resolutionList.get(resolutionList.size() - 1);
        assertThat(testResolution.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testResolution.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testResolution.getDescription()).isEqualTo(UPDATED_DESCRIPTION);

        // Validate the Resolution in Elasticsearch
        Resolution resolutionEs = resolutionSearchRepository.findOne(testResolution.getId());
        assertThat(resolutionEs).isEqualToIgnoringGivenFields(testResolution);
    }

    @Test
    public void updateNonExistingResolution() throws Exception {
        int databaseSizeBeforeUpdate = resolutionRepository.findAll().size();

        // Create the Resolution

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restResolutionMockMvc.perform(put("/api/resolutions")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(resolution)))
            .andExpect(status().isCreated());

        // Validate the Resolution in the database
        List<Resolution> resolutionList = resolutionRepository.findAll();
        assertThat(resolutionList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    public void deleteResolution() throws Exception {
        // Initialize the database
        resolutionRepository.save(resolution);
        resolutionSearchRepository.save(resolution);
        int databaseSizeBeforeDelete = resolutionRepository.findAll().size();

        // Get the resolution
        restResolutionMockMvc.perform(delete("/api/resolutions/{id}", resolution.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate Elasticsearch is empty
        boolean resolutionExistsInEs = resolutionSearchRepository.exists(resolution.getId());
        assertThat(resolutionExistsInEs).isFalse();

        // Validate the database is empty
        List<Resolution> resolutionList = resolutionRepository.findAll();
        assertThat(resolutionList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    public void searchResolution() throws Exception {
        // Initialize the database
        resolutionRepository.save(resolution);
        resolutionSearchRepository.save(resolution);

        // Search the resolution
        restResolutionMockMvc.perform(get("/api/_search/resolutions?query=id:" + resolution.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(resolution.getId())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE.toString())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())));
    }

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Resolution.class);
        Resolution resolution1 = new Resolution();
        resolution1.setId("id1");
        Resolution resolution2 = new Resolution();
        resolution2.setId(resolution1.getId());
        assertThat(resolution1).isEqualTo(resolution2);
        resolution2.setId("id2");
        assertThat(resolution1).isNotEqualTo(resolution2);
        resolution1.setId(null);
        assertThat(resolution1).isNotEqualTo(resolution2);
    }
}
